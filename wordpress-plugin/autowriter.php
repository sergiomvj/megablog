<?php
/**
 * Plugin Name: AutoWriter Multisite
 * Plugin URI:  https://github.com/sergiomvj/megablog
 * Description: Automated article generation for WordPress Multisite via Central Dashboard.
 * Version:     1.0.0
 * Author:      AutoWriter Team
 * Author URI:  https://github.com/sergiomvj/megablog
 * Text Domain: autowriter
 * Network:     true
 * License:     GPL-2.0+
 */

defined('ABSPATH') || exit;

// Define constants
define('AUTOWRITER_VERSION', '1.0.0');
define('AUTOWRITER_PATH', plugin_dir_path(__FILE__));
define('AUTOWRITER_URL', plugin_dir_url(__FILE__));

// Autoload classes (simple manual autoloader or include files)
require_once AUTOWRITER_PATH . 'includes/class-autowriter-bootstrap.php';
require_once AUTOWRITER_PATH . 'includes/class-autowriter-rest.php';
require_once AUTOWRITER_PATH . 'includes/class-autowriter-jobs.php';
require_once AUTOWRITER_PATH . 'includes/class-autowriter-wp-posts.php';
require_once AUTOWRITER_PATH . 'includes/class-autowriter-media.php';
require_once AUTOWRITER_PATH . 'includes/class-autowriter-seo.php';
require_once AUTOWRITER_PATH . 'includes/class-autowriter-security.php';
require_once AUTOWRITER_PATH . 'includes/class-autowriter-admin-network.php';
require_once AUTOWRITER_PATH . 'includes/class-autowriter-utils.php';

/**
 * Initialize the plugin.
 */
function autowriter_init() {
    $bootstrap = new AutoWriter_Bootstrap();
    $bootstrap->run();
}

add_action('plugins_loaded', 'autowriter_init');

/**
 * Activation hook.
 */
register_activation_hook(__FILE__, ['AutoWriter_Bootstrap', 'activate']);
