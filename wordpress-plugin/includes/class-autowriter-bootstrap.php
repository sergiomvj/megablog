<?php

class AutoWriter_Bootstrap {

    public function run() {
        // Initialize REST API
        $rest = new AutoWriter_REST();
        $rest->init();

        // Initialize Admin UI
        if (is_admin()) {
            $admin = new AutoWriter_Admin_Network();
            $admin->init();
        }
    }

    public static function activate() {
        if (!is_multisite()) {
            deactivate_plugins(plugin_basename(AUTOWRITER_PATH . 'autowriter.php'));
            wp_die(__('AutoWriter Multisite requires WordPress Multisite to be enabled.', 'autowriter'));
        }

        self::create_tables();
        
        // Default settings
        if (false === get_site_option('autowriter_settings')) {
            update_site_option('autowriter_settings', [
                'auth_mode' => 'application_password',
                'hmac_secret' => bin2hex(random_bytes(32)),
                'default_post_status' => 'draft',
                'image_mode' => 'mixed',
                'logging_level' => 'info',
            ]);
        }
    }

    private static function create_tables() {
        global $wpdb;
        $charset_collate = $wpdb->get_charset_collate();
        $base_prefix = $wpdb->base_prefix;

        $sql_template = file_get_contents(AUTOWRITER_PATH . 'migrations/schema.sql');
        $sql = str_replace('{base_prefix}', $base_prefix, $sql_template);

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }
}
