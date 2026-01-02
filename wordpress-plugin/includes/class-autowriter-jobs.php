<?php

class AutoWriter_Jobs {

    public function process_payload($payload) {
        global $wpdb;
        $table_name = $wpdb->base_prefix . 'autowriter_jobs';

        // Check for idempotency
        $existing = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM $table_name WHERE idempotency_key = %s",
            $payload['idempotency_key']
        ));

        if ($existing && $existing->status === 'done') {
            return rest_ensure_response([
                'job_id' => $existing->id,
                'status' => 'done',
                'post_id' => $existing->post_id,
                'post_url' => get_permalink($existing->post_id),
                'message' => 'Job already completed (idempotent)'
            ]);
        }

        // Create or update job record
        $job_id = $existing ? $existing->id : null;
        $data = [
            'external_job_id' => $payload['external_job_id'] ?? '',
            'blog_id' => $payload['blog_id'],
            'status' => 'running',
            'step' => 'processing',
            'idempotency_key' => $payload['idempotency_key'],
            'payload_hash' => hash('sha256', json_encode($payload)),
            'updated_at' => current_time('mysql'),
        ];

        if ($job_id) {
            $wpdb->update($table_name, $data, ['id' => $job_id]);
        } else {
            $data['created_at'] = current_time('mysql');
            $wpdb->insert($table_name, $data);
            $job_id = $wpdb->insert_id;
        }

        try {
            return $this->execute_job($job_id, $payload);
        } catch (Exception $e) {
            $this->log($job_id, 'error', $e->getMessage());
            $wpdb->update($table_name, [
                'status' => 'failed',
                'error_message' => $e->getMessage(),
                'updated_at' => current_time('mysql'),
            ], ['id' => $job_id]);
            
            return new WP_Error('job_failed', $e->getMessage(), ['status' => 500]);
        }
    }

    private function execute_job($job_id, $payload) {
        global $wpdb;
        $table_name = $wpdb->base_prefix . 'autowriter_jobs';

        // 1. Switch to blog
        switch_to_blog($payload['blog_id']);

        $post_handler = new AutoWriter_WP_Posts();
        $media_handler = new AutoWriter_Media();
        $seo_handler = new AutoWriter_SEO();

        // 2. Create Post Draft
        $wp_post_id = $post_handler->create_post_draft($payload['post']);
        $this->log($job_id, 'info', "Draft created: $wp_post_id");

        // 3. Process Images
        if (!empty($payload['images'])) {
            $featured_id = null;
            if (!empty($payload['images']['featured'])) {
                $featured_id = $media_handler->sideload_image($payload['images']['featured'], $wp_post_id);
                if ($featured_id) {
                    set_post_thumbnail($wp_post_id, $featured_id);
                }
            }

            if (!empty($payload['images']['top'])) {
                $top_image_id = $media_handler->sideload_image($payload['images']['top'], $wp_post_id);
                if ($top_image_id) {
                    $post_handler->insert_top_image($wp_post_id, $top_image_id, $payload['images']['top']);
                }
            }
        }

        // 4. Apply SEO
        if (!empty($payload['seo'])) {
            $seo_handler->apply_seo($wp_post_id, $payload['seo']);
        }

        // 5. Cleanup
        restore_current_blog();

        // Update Job
        $wpdb->update($table_name, [
            'status' => 'done',
            'step' => 'completed',
            'post_id' => $wp_post_id,
            'updated_at' => current_time('mysql'),
        ], ['id' => $job_id]);

        return rest_ensure_response([
            'job_id' => $job_id,
            'status' => 'done',
            'post_id' => $wp_post_id,
            'post_url' => get_permalink($wp_post_id)
        ]);
    }

    public function get_job_by_id($id) {
        global $wpdb;
        $table_name = $wpdb->base_prefix . 'autowriter_jobs';
        return $wpdb->get_row($wpdb->prepare("SELECT * FROM $table_name WHERE id = %d", $id));
    }

    private function log($job_id, $level, $message, $context = []) {
        global $wpdb;
        $table_name = $wpdb->base_prefix . 'autowriter_logs';
        $wpdb->insert($table_name, [
            'job_id' => $job_id,
            'level' => $level,
            'message' => $message,
            'context_json' => json_encode($context),
            'created_at' => current_time('mysql'),
        ]);
    }
}
