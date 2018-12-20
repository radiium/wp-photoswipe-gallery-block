/*
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { Component, createElement } from '@wordpress/element';
*/

const { registerBlockType } = wp.blocks;
const { __ } = wp.i18n;
const { Component, createElement } = wp.element;
const { RichText, mediaUpload } = wp.editor;
const { createBlobURL } = wp.blob;
const { G, Path, SVG } = wp.components;


// import { default as GalleryEdit, defaultColumnsNumber } from './edit';
// import { default as save} from './save';
// import { default as blockAttributes} from './attributes';

import './styles/editor.scss';
import './styles/style.scss';
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import { default as Edit, defaultColumnsNumber } from './edit';

const blockAttributes = {
	images: {
		type: 'array',
		default: [],
		source: 'query',
		selector: 'figure.gallery-item',
		query: {
			url: {
				source: 'attribute',
				selector: 'img.gallery-img',
				attribute: 'data-src',
			},
			id: {
				source: 'attribute',
				selector: 'img.gallery-img',
				attribute: 'data-id',
			},
			alt: {
				source: 'attribute',
				selector: 'img.gallery-img',
				attribute: 'alt',
				default: '',
			},
			caption: {
				type: 'string',
				source: 'html',
				selector: 'figcaption',
			},
		},
	},
	ids: {
		type: 'array',
		default: [],
	},

	// General settings
	galleryPadding: {
		type: 'number',
		default: 0,
	},
	galleryPaddingMobile: {
		type: 'number',
		default: 0,
	},
	gutter: {
		type: 'number',
		default: 15,
	},
	gutterMobile: {
		type: 'number',
		default: 10,
	},
	showCaptions: {
		type: 'boolean',
		default: true,
	},

	// Layout settings
	layoutType: {
		type: 'string',
		default: 'row',
	},
	layoutStackDim: {
		type: 'number',
		default: 200,
	},
	layoutRowDim: {
		type: 'number',
		default: 200,
	},
	layoutColumnDim: {
		type: 'number',
		default: 200,
	},
	layoutGridDim: {
		type: 'number',
		default: 200,
	},

	// Layout items settings
	imageCrop: {
		type: 'boolean',
		default: false,
	},
	imageShapeType: {
		type: 'string',
		default: 'square',
	},
	imageShapeValue: {
		type: 'string',
	},
};

const parseShortcodeIds = ( ids ) => {
	if ( ! ids ) {
		return [];
	}

	return ids.split( ',' ).map( ( id ) => (
		parseInt( id, 10 )
	) );
};

const settings = {
	title: __( 'WP Photoswipe Gallery' ),
	description: __( 'Display multiple images in a rich gallery with photoswipe lightbox.' ),
	icon: <SVG viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><Path fill="none" d="M0 0h24v24H0V0z" /><G><Path d="M20 4v12H8V4h12m0-2H8L6 4v12l2 2h12l2-2V4l-2-2z" /><Path d="M12 12l1 2 3-3 3 4H9z" /><Path d="M2 6v14l2 2h14v-2H4V6H2z" /></G></SVG>,
	category: 'common',
	keywords: [ __( 'images' ), __( 'photos' ) ],
	attributes: blockAttributes,
	supports: {
		align: false,
	},

	edit: Edit,




	save( { attributes } ) {
		const {
			images,

			layoutType,
			layoutStackDim,
			layoutRowDim,
			layoutColumnDim,
			layoutGridDim,

			imageCrop,
			imageShapeType,
			imageShapeValue,

			galleryPadding,
			galleryPaddingMobile,
			gutter,
			gutterMobile,
			showCaptions,
		} = attributes;

		const galleryClass = classnames('gallery-container', {
			[`layout-type-${ layoutType }`]: layoutType,
			[`layout-stack-dim-${ layoutStackDim }`]: layoutType === 'stack' && layoutStackDim,
			[`layout-row-dim-${ layoutRowDim }`]: layoutType === 'row' && layoutRowDim,
			[`layout-column-dim-${ layoutColumnDim }`]: layoutType === 'column' && layoutColumnDim,
			[`layout-grid-dim-${ layoutGridDim }`]: layoutType === 'grid' && layoutGridDim,

			[`image-crop`]: imageCrop,
			[`image-shape-type-${ imageShapeType }`]: imageCrop && imageShapeType,
			[`image-shape-value`]: imageCrop && imageShapeType === 'custom',

			[`gallery-padding-${ galleryPadding }`]: galleryPadding > 0,
			[`gallery-padding-mobile-${ galleryPaddingMobile }`]: galleryPaddingMobile > 0,
			[`no-gutter`]: (gutter === 0) ,
			[`no-gutter-mobile`]: (gutterMobile === 0) ,
			[`gutter-${ gutter }`]: gutter > 0,
			[`gutter-mobile-${ gutterMobile }`]: gutterMobile > 0,
		});

		const itemClass = classnames('gallery-item');
		const itemStyle = (imageShapeType === 'custom' && imageShapeValue)
			? { clipPath: imageShapeValue }
			: {};

		const linkClass = classnames('gallery-link');
		const captionClass = classnames('galleryCaption');
		const captionsStyle = {
			display: !!showCaptions ? 'table' : 'none'
		};



		// return null;

		return (
			<div>
				<div className={ galleryClass }
					itemtype="http://schema.org/ImageGallery"
					itemscope="">

					{ images.map((image) => {

						const imgClass = classnames('gallery-img gallery-img-prod', {
							[`wp-image-${ image.id }`]: image.id
						});

						return (
							<figure key={ image.id || image.url }
								className={ itemClass }
								style={ itemStyle }>

								<a className={ linkClass }
									href={ image.url }
									itemprop="contentUrl"
									data-size="400x300">

									<img className={ imgClass }
										data-id={ image.id }
										draggable="false"
										itemprop="thumbnail"
										data-src={ image.url }
										alt={ image.alt } />
								</a>

								{ image.caption && image.caption.length > 0 && (
									<RichText.Content
										className={ captionClass }
										style={ captionsStyle }
										tagName="figcaption"
										value={ image.caption }
										itemprop="caption description"/>
								) }
							</figure>
						);
					})}
				</div>
				{ createPhotoswipeGalleryTemplate() }
			</div>
		);
	},
};

registerBlockType( 'radiium/photoswipe-gallery', settings);

// Photoswipe lightbox gallery snippet
const createPhotoswipeGalleryTemplate = () => {
	return(
        <div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">
			<div class="pswp__bg"></div>
			<div class="pswp__scroll-wrap">
				<div class="pswp__container">
					<div class="pswp__item"></div>
					<div class="pswp__item"></div>
					<div class="pswp__item"></div>
				</div>
				<div class="pswp__ui pswp__ui--hidden">
					<div class="pswp__top-bar">
						<div class="pswp__counter"></div>
						<button class="pswp__button pswp__button--close" title="Close (Esc)"></button>
						<button class="pswp__button pswp__button--share" title="Share"></button>
						<button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>
						<button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>
						<div class="pswp__preloader">
							<div class="pswp__preloader__icn">
							  <div class="pswp__preloader__cut">
								<div class="pswp__preloader__donut"></div>
							  </div>
							</div>
						</div>
					</div>
					<div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
						<div class="pswp__share-tooltip"></div>
					</div>
					<button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button>
					<button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button>
					<div class="pswp__caption">
						<div class="pswp__caption__center"></div>
					</div>
				</div>
			</div>
        </div>
    );
}
