<?php
/**
 * Load @@pkg.title block assets.
 *
 * @package   @@pkg.title
 * @author    @@pkg.author
 * @link      @@pkg.author_uri
 * @license   @@pkg.license
 */

 if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class WPPGB_Plugin_Assets {

    private static $instance;

    public static function register() {
		if ( null === self::$instance ) {
			self::$instance = new WPPGB_Plugin_Assets();
		}
	}

	private $_dir;
	private $_url;
	private $_version;
	private $_slug;


	private function __construct() {
		$this->_version = WPPGB_VERSION;
		$this->_slug    = 'wppgb';
		$this->_dir     = untrailingslashit( plugin_dir_path( '/', __FILE__ ) );
		$this->_url     = untrailingslashit( plugins_url( '/', dirname( __FILE__ ) ) );

        add_action( 'init', array( $this, 'register_block' ), 99 );
        add_action( 'enqueue_block_assets', array( $this, 'block_assets' ) );
        add_action( 'enqueue_block_editor_assets', array( $this, 'editor_assets' ) );
	}


	public function register_block() {
		if ( ! function_exists( 'register_block_type' ) ) {
			return;
        }

        /*
        register_block_type(
			'radiium/photoswipe-gallery',
			array(
				'style'         => $this->_slug . '-style-css',
				'editor_script' => $this->_slug . '-editor-js',
                'editor_style'  => $this->_slug . '-editor-css',
                'render_callback' => array( $this, 'render_block_cb' )

			)
        );
        */
    }

    public function render_block_cb( $attr ) {
        $html = '<div class="wppgb-wrapper">';
        $html .= '<div class="wppgb-control-container">The control</div>';
        $html .= '<div class="wppgb-gallery-container">The gallery</div>';
        $html .= '';

        $html .= $this->get_photoswipe_template();
        $html .= '</div>';


        error_log('render_block_cb');
        echo '<pre>';
        print_r( $attr );
        echo '</pre>';

        return $html;
    }

    public function get_photoswipe_template() {
        $snippet = ''
        . '<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">'
		. '	<div class="pswp__bg"></div>'
		. '	<div class="pswp__scroll-wrap">'
		. '		<div class="pswp__container">'
		. '			<div class="pswp__item"></div>'
		. '			<div class="pswp__item"></div>'
		. '			<div class="pswp__item"></div>'
		. '		</div>'
		. '		<div class="pswp__ui pswp__ui--hidden">'
		. '			<div class="pswp__top-bar">'
		. '				<div class="pswp__counter"></div>'
		. '				<button class="pswp__button pswp__button--close" title="Close (Esc)"></button>'
		. '				<button class="pswp__button pswp__button--share" title="Share"></button>'
		. '				<button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>'
		. '				<button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>'
		. '				<div class="pswp__preloader">'
		. '					<div class="pswp__preloader__icn">'
		. '					  <div class="pswp__preloader__cut">'
		. '						<div class="pswp__preloader__donut"></div>'
		. '					  </div>'
		. '					</div>'
		. '				</div>'
		. '			</div>'
		. '			<div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">'
		. '				<div class="pswp__share-tooltip"></div>'
		. '			</div>'
		. '			<button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button>'
		. '			<button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button>'
		. '			<div class="pswp__caption">'
		. '				<div class="pswp__caption__center"></div>'
		. '			</div>'
		. '		</div>'
		. '	</div>'
        . '</div>';

        return $snippet;
    }


	public function block_assets() {

        // Styles.
        $styleCSS = '/dist/blocks.style.build.css';
        wp_enqueue_style(
            $this->_slug . '-style-css',
            $this->_url . $styleCSS,
            array( 'wp-editor' ),
            $this->get_file_version( $styleCSS )
        );

        if ( !is_admin() ) {

            // Styles
            $photoswipeCSS = '/dist/js/vendors/PhotoSwipe-4.1.2/photoswipe.min.css';
            wp_enqueue_style(
                $this->_slug . '-photoswipe-css',
                $this->_url . $photoswipeCSS,
                array(),
                $this->get_file_version( $photoswipeCSS )
            );

            $photoswipeUiCSS = '/dist/js/vendors/PhotoSwipe-4.1.2/default-skin/default-skin.min.css';
            wp_enqueue_style(
                $this->_slug . '-photoswipe-ui-css',
                $this->_url . $photoswipeUiCSS,
                array(),
                $this->get_file_version( $photoswipeUiCSS )
            );

            // Scripts
            $photoswipeJs = '/dist/js/vendors/PhotoSwipe-4.1.2/photoswipe.min.js';
            wp_enqueue_script(
                $this->_slug . '-photoswipe-js',
                $this->_url . $photoswipeJs,
                array(),
                $this->get_file_version( $photoswipeJs )
            );

            $photoswipeUiJs = '/dist/js/vendors/PhotoSwipe-4.1.2/photoswipe-ui-default.min.js';
            wp_enqueue_script(
                $this->_slug . '-photoswipe-ui-default-js',
                $this->_url . $photoswipeUiJs,
                array(),
                $this->get_file_version( $photoswipeUiJs )
            );

            $lozadPolyFillJs = '/dist/js/vendors/lozad-1.7.0/polyfill.js';
            wp_enqueue_script(
                $this->_slug . '-lozad-polyfill-js',
                $this->_url . $lozadPolyFillJs,
                array(),
                $this->get_file_version( $lozadPolyFillJs )
            );

            $lozadJs = '/dist/js/vendors/lozad-1.7.0/lozad.min.js';
            wp_enqueue_script(
                $this->_slug . '-lozad-js',
                $this->_url . $lozadJs,
                array( $this->_slug . '-lozad-polyfill-js' ),
                $this->get_file_version( $lozadJs )
            );

            $mainJs = '/dist/js/main.js';
            wp_enqueue_script(
                $this->_slug . '-main-js',
                $this->_url . $mainJs,
                array('jquery', $this->_slug . '-lozad-js' ,),
                $this->get_file_version( $mainJs )
            );
        }
    }

	public function editor_assets() {

        // Styles
        $editorCSS = '/dist/blocks.editor.build.css';
        wp_enqueue_style(
            $this->_slug . '-editor-css',
            $this->_url . $editorCSS,
            array( 'wp-edit-blocks' ),
            $this->get_file_version( $editorCSS )
        );

        // Scripts
        $blockJs = '/dist/blocks.build.js';
        wp_enqueue_script(
            $this->_slug . '-editor-js',
            $this->_url . $blockJs,
            array(
                'wp-blocks',
                'wp-i18n',
                'wp-element',
                'wp-editor',
                'wp-plugins',
                'wp-components',
                'wp-edit-post',
                'wp-api'
            ),
            $this->get_file_version( $blockJs ),
            true
        );
    }

    private function get_file_version($file_path) {
        if ( true === WPPGB_DEBUG ) {
            return filemtime( WPPGB_PLUGIN_DIR . $file_path );
        } else {
            return $this->_version;
        }
    }
}

WPPGB_Plugin_Assets::register();