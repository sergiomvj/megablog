<?php

class AutoWriter_Admin_Network {

    public function init() {
        add_action('network_admin_menu', [$this, 'add_menu']);
    }

    public function add_menu() {
        add_menu_page(
            'AutoWriter',
            'AutoWriter',
            'manage_network',
            'autowriter',
            [$this, 'render_settings_page'],
            'dashicons-edit-page'
        );
        
        add_submenu_page(
            'autowriter',
            'Settings',
            'Settings',
            'manage_network',
            'autowriter-settings',
            [$this, 'render_settings_page']
        );

        add_submenu_page(
            'autowriter',
            'Jobs Monitor',
            'Jobs Monitor',
            'manage_network',
            'autowriter-jobs',
            [$this, 'render_jobs_page']
        );
    }

    public function render_settings_page() {
        if (isset($_POST['autowriter_save_settings'])) {
            check_admin_referer('autowriter_settings_action');
            
            $new_settings = [
                'auth_mode' => sanitize_text_field($_POST['auth_mode']),
                'hmac_secret' => sanitize_text_field($_POST['hmac_secret']),
                'default_post_status' => sanitize_text_field($_POST['default_post_status']),
                'image_mode' => sanitize_text_field($_POST['image_mode']),
                'logging_level' => sanitize_text_field($_POST['logging_level']),
            ];
            
            update_site_option('autowriter_settings', $new_settings);
            echo '<div class="updated"><p>Settings saved.</p></div>';
        }

        $settings = get_site_option('autowriter_settings');
        ?>
        <div class="wrap">
            <h1>AutoWriter Network Settings</h1>
            <form method="post">
                <?php wp_nonce_field('autowriter_settings_action'); ?>
                <table class="form-table">
                    <tr>
                        <th>Auth Mode</th>
                        <td>
                            <select name="auth_mode">
                                <option value="application_password" <?php selected($settings['auth_mode'], 'application_password'); ?>>Application Password</option>
                                <option value="hmac" <?php selected($settings['auth_mode'], 'hmac'); ?>>Application Password + HMAC</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th>HMAC Secret</th>
                        <td>
                            <input type="text" name="hmac_secret" value="<?php echo esc_attr($settings['hmac_secret']); ?>" class="large-text">
                            <p class="description">Use this secret in your Central Dashboard to sign requests.</p>
                        </td>
                    </tr>
                </table>
                <p class="submit">
                    <input type="submit" name="autowriter_save_settings" class="button-primary" value="Save Changes">
                </p>
            </form>
        </div>
        <?php
    }

    public function render_jobs_page() {
        global $wpdb;
        $table_name = $wpdb->base_prefix . 'autowriter_jobs';
        $jobs = $wpdb->get_results("SELECT * FROM $table_name ORDER BY created_at DESC LIMIT 50");
        ?>
        <div class="wrap">
            <h1>AutoWriter Jobs Monitor</h1>
            <table class="wp-list-table widefat fixed striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Blog ID</th>
                        <th>Status</th>
                        <th>Post ID</th>
                        <th>Created At</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($jobs as $job): ?>
                    <tr>
                        <td><?php echo esc_html($job->external_job_id); ?></td>
                        <td><?php echo esc_html($job->blog_id); ?></td>
                        <td><?php echo esc_html($job->status); ?></td>
                        <td><?php echo $job->post_id ? esc_html($job->post_id) : '-'; ?></td>
                        <td><?php echo esc_html($job->created_at); ?></td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
        <?php
    }
}
