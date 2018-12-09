<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Add custom image size
if ( !function_exists('blask_child_theme_setup' ) ) {
    function radiium_photoswipe_gallery_theme_setup() {
        add_image_size( 'custom_size_1',  600, 9999, false );
        add_image_size( 'custom_size_2',  800, 9999, false );
        add_image_size( 'custom_size_3', 1000, 9999, false );
        add_image_size( 'custom_size_4', 1200, 9999, false );
        add_image_size( 'custom_size_5', 1400, 9999, false );
    }
    add_action( 'after_setup_theme', 'radiium_photoswipe_gallery_theme_setup' );
}

// Support custom image size in media upload panel
if ( !function_exists('my_custom_sizes' ) ) {
    function radiium_photoswipe_gallery_custom_sizes( $sizes ) {
        return array_merge( $sizes, array(
            'custom_size_1' => __( 'Size 1 600w' ),
            'custom_size_2' => __( 'Size 2 800w' ),
            'custom_size_3' => __( 'Size 3 1000w' ),
            'custom_size_4' => __( 'Size 4 1200w' ),
            'custom_size_5' => __( 'Size 5 1400w' ),
        ) );
    }
    add_filter( 'image_size_names_choose', 'radiium_photoswipe_gallery_custom_sizes' );
}

// Load admin and frontend scripts
if ( !function_exists('radiium_photoswipe_gallery_assets' ) ) {
    function radiium_photoswipe_gallery_assets() {
        // Scripts
        wp_enqueue_style(
            'radiium-photoswipe_gallery-style-css',
            plugins_url( 'dist/blocks.style.build.css', dirname( __FILE__ ) ),
            array( 'wp-editor' )
            // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.style.build.css' ) // Version: File modification time.
        );

        if ( !is_admin() ) {
            $scriptsFolder =  'vendors';
            $photoswipeCSS 		= $scriptsFolder . '/PhotoSwipe-4.1.2/photoswipe.min.css';
            $photoswipeUiCSS 	= $scriptsFolder . '/PhotoSwipe-4.1.2/default-skin/default-skin.min.css';
            $photoswipe 		= $scriptsFolder . '/PhotoSwipe-4.1.2/photoswipe.min.js';
            $photoswipeUi 		= $scriptsFolder . '/PhotoSwipe-4.1.2/photoswipe-ui-default.min.js';
            $scrollReveal 		= $scriptsFolder . '/Scrollreveal-4.0.5/scrollreveal.min.js';
            $mainJs 			= $scriptsFolder . '/main.js';

            // Css
            wp_enqueue_style(
                'photoswipe-css',
                plugins_url( $photoswipeCSS, __FILE__ ),
                array(),
                filemtime( plugin_dir_path( __FILE__ ) . $photoswipeCSS )
            );

            wp_enqueue_style(
                'photoswipe-ui-css',
                plugins_url( $photoswipeUiCSS, __FILE__ ),
                array(),
                filemtime( plugin_dir_path( __FILE__ ) . $photoswipeUiCSS )
            );


            // Js
            wp_enqueue_script(
                'photoswipe-js',
                plugins_url( $photoswipe, __FILE__ ),
                array(),
                filemtime( plugin_dir_path( __FILE__ ) . $photoswipe )
            );

            wp_enqueue_script(
                'photoswipe-ui-default-js',
                plugins_url( $photoswipeUi, __FILE__ ),
                array(),
                filemtime( plugin_dir_path( __FILE__ ) . $photoswipeUi )

            );

            wp_enqueue_script(
                'scroll-reveal-js',
                plugins_url( $scrollReveal, __FILE__ ),
                array(),
                filemtime( plugin_dir_path( __FILE__ ) . $scrollReveal )
            );

            wp_enqueue_script(
                'radiium-gallery-main',
                plugins_url( $mainJs, __FILE__ ),
                array('jquery'),
                filemtime( plugin_dir_path( __FILE__ ) . $mainJs )
            );
        }
    }
    add_action( 'enqueue_block_assets', 'radiium_photoswipe_gallery_assets' );
}


// Load admin scripts
if ( !function_exists('radiium_photoswipe_gallery_editor_assets' ) ) {
    function radiium_photoswipe_gallery_editor_assets() {
        // Css
        wp_enqueue_style(
            'radiium-photoswipe_gallery-block-editor-css',
            plugins_url( 'dist/blocks.editor.build.css', dirname( __FILE__ ) ),
            array( 'wp-edit-blocks' )
            // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.editor.build.css' ) // Version: File modification time.
        );

        // Js
        wp_enqueue_script(
            'radiium-photoswipe_gallery-block-js',
            plugins_url( '/dist/blocks.build.js', dirname( __FILE__ ) ),
            array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor' ),
            // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.build.js' ), // Version: File modification time.
            true
        );
    }
    add_action( 'enqueue_block_editor_assets', 'radiium_photoswipe_gallery_editor_assets' );
}

?>
