<?php

class AutoWriter_WP_Posts {

    public function create_post_draft($post_data) {
        $post_id = wp_insert_post([
            'post_title'   => wp_strip_all_tags($post_data['title']),
            'post_content' => $post_data['content_html'],
            'post_status'  => $post_data['status'] ?? 'draft',
            'post_name'    => sanitize_title($post_data['slug']),
            'post_excerpt' => $post_data['excerpt'] ?? '',
            'post_author'  => $post_data['author']['id'] ?? get_current_user_id(),
            'post_type'    => 'post',
        ]);

        if (is_wp_error($post_id)) {
            throw new Exception("Failed to create post: " . $post_id->get_error_message());
        }

        // Categories
        if (!empty($post_data['categories'])) {
            $cat_ids = [];
            foreach ($post_data['categories'] as $cat_name) {
                $cat = get_term_by('name', $cat_name, 'category');
                if (!$cat) {
                    $cat = wp_insert_term($cat_name, 'category');
                    if (!is_wp_error($cat)) {
                        $cat_ids[] = $cat['term_id'];
                    }
                } else {
                    $cat_ids[] = $cat->term_id;
                }
            }
            wp_set_post_categories($post_id, $cat_ids);
        }

        // Tags
        if (!empty($post_data['tags'])) {
            wp_set_post_tags($post_id, $post_data['tags']);
        }

        return $post_id;
    }

    public function insert_top_image($post_id, $attachment_id, $image_data) {
        $post = get_post($post_id);
        $image_url = wp_get_attachment_url($attachment_id);
        $alt = $image_data['alt'] ?? '';

        // Insert as Gutenberg block if possible, or simple HTML
        $figure = sprintf(
            '<!-- wp:image {"id":%d,"sizeSlug":"large","linkDestination":"none"} -->
            <figure class="wp-block-image size-large"><img src="%s" alt="%s" class="wp-image-%d"/></figure>
            <!-- /wp:image -->',
            $attachment_id,
            esc_url($image_url),
            esc_attr($alt),
            $attachment_id
        );

        $updated_content = $figure . "\n\n" . $post->post_content;

        wp_update_post([
            'ID' => $post_id,
            'post_content' => $updated_content
        ]);
    }
}
