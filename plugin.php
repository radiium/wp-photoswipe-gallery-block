<?php
 /**
  *
 * Plugin Name: PhotoSwipe Gallery block
 * Plugin URI: https://github.com/radiium/wp-photoswipe-gallery-block
 * Description: Gutenberg gallery block with PhotoSwipe
 * Version: 1.0.0
 * Author: radiium
 * Author URI: https://github.com/radiium
 * License: GPL2+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @package radiium
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Block Initializer.
 */
require_once plugin_dir_path( __FILE__ ) . 'src/init.php';
