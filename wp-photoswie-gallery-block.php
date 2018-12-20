<?php
/**
 * Plugin Name: WP Photoswipe Gallery
 * Plugin URI: https://github.com/radiium/wp-photoswipe-gallery-block
 * Description: Gutenberg PhotoSwipe Gallery Block
 * Version: 1.0.0
 * Author: radiium
 * Author URI: https://github.com/radiium
 * License: GPL2+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @link https://github.com/radiium/wp-photoswipe-gallery-block
 * @since 1.0.0
 * @package radiium
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'WPPGB_plugin' ) ) :

    final class WPPGB_plugin {

        private static $instance;

        public static function instance() {
            if ( ! isset( self::$instance ) && ! ( self::$instance instanceof WPPGB_plugin ) ) {
                self::$instance = new WPPGB_plugin();
                self::$instance->init();
            }
            return self::$instance;
        }


        // Throw error on object clone.
		public function __clone() {
			_doing_it_wrong( __FUNCTION__, esc_html__( 'Cheating huh?', 'gallery-block' ), '1.0' );
		}

		// Disable unserializing of the class.
		public function __wakeup() {
			_doing_it_wrong( __FUNCTION__, esc_html__( 'Cheating huh?', 'gallery-block' ), '1.0' );
        }

        // Init plugin
        private function init() {
            $this->define( 'WPPGB_DEBUG', false );
            $this->define( 'WPPGB_VERSION', '1.0.0' );
            $this->define( 'WPPGB_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
            $this->define( 'WPPGB_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

            // add_action( 'init', array( $this, 'load_textdomain' ) );
            require_once WPPGB_PLUGIN_DIR . 'includes/assets.php';
        }

        private function define( $name, $value ) {
			if ( ! defined( $name ) ) {
				define( $name, $value );
			}
        }
    }
endif;

function wppgb_plugin() {
	return WPPGB_plugin::instance();
}

// Get the plugin running. Load on plugins_loaded action to avoid issue on multisite.
if ( function_exists( 'is_multisite' ) && is_multisite() ) {
	add_action( 'plugins_loaded', 'wppgb_plugin', 90 );
} else {
	wppgb_plugin();
}