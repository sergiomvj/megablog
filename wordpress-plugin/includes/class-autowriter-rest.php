<?php

class AutoWriter_REST {

    private $namespace = 'autowriter/v1';

    public function init() {
        add_action('rest_api_init', [$this, 'register_routes']);
    }

    public function register_routes() {
        register_rest_route($this->namespace, '/jobs', [
            'methods' => 'POST',
            'callback' => [$this, 'create_job'],
            'permission_callback' => [$this, 'check_permissions'],
        ]);

        register_rest_route($this->namespace, '/jobs/(?P<id>\d+)', [
            'methods' => 'GET',
            'callback' => [$this, 'get_job'],
            'permission_callback' => [$this, 'check_permissions'],
        ]);

        register_rest_route($this->namespace, '/health', [
            'methods' => 'GET',
            'callback' => [$this, 'health_check'],
            'permission_callback' => '__return_true',
        ]);
    }

    public function check_permissions($request) {
        // Simple permission check for now - should check for manage_network
        // or validate HMAC signature if enabled.
        if (!current_user_can('manage_network')) {
            $security = new AutoWriter_Security();
            return $security->validate_request($request);
        }
        return true;
    }

    public function create_job($request) {
        $params = $request->get_json_params();
        
        if (empty($params['blog_id']) || empty($params['idempotency_key'])) {
            return new WP_Error('invalid_payload', 'Missing blog_id or idempotency_key', ['status' => 400]);
        }

        $jobs_engine = new AutoWriter_Jobs();
        return $jobs_engine->process_payload($params);
    }

    public function get_job($request) {
        $id = $request['id'];
        $jobs_engine = new AutoWriter_Jobs();
        $job = $jobs_engine->get_job_by_id($id);

        if (!$job) {
            return new WP_Error('not_found', 'Job not found', ['status' => 404]);
        }

        return rest_ensure_response($job);
    }

    public function health_check() {
        return rest_ensure_response([
            'status' => 'ok',
            'multisite' => is_multisite(),
            'php_version' => PHP_VERSION,
            'wp_version' => get_bloginfo('version'),
            'seo_provider' => (new AutoWriter_SEO())->detect_provider(),
        ]);
    }
}
