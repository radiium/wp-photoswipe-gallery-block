import { filter, every, map, some } from 'lodash';

import { __ } from '@wordpress/i18n';
import { createBlock } from '@wordpress/blocks';
import { mediaUpload } from '@wordpress/editor';
import { createBlobURL } from '@wordpress/blob';
import { G, Path, SVG } from '@wordpress/components';
const createElement = wp.element.createElement;

import { default as edit} from './edit';
import {
	pickRelevantMediaFiles,
	parseShortcodeIds } from './utils';

import './styles/editor.scss';
import './styles/style.scss';

export const name = 'radiium/photoswipe-gallery';

const blockAttributes = {
	images: {
		type: 'array',
		default: [],
		source: 'query',
		selector: 'div.galleryContainer .galleryItem',
		query: {
			url: {
				source: 'attribute',
				selector: 'img',
				attribute: 'src'
			},
			link: {
				source: 'attribute',
				selector: 'img',
				attribute: 'data-link'
			},
			alt: {
				source: 'attribute',
				selector: 'img',
				attribute: 'alt',
				default: ''
			},
			id: {
				source: 'attribute',
				selector: 'img',
				attribute: 'data-id'
			},

			sizes: {
				source: 'attribute',
				selector: 'img',
				attribute: 'data-sizes-obj',
				default: '{}'
			}

		},
	},
	ids: {
		type: 'array',
		default: []
	},
	linkTo: {
		type: 'string',
		default: 'none'
	},
};

export const settings = {
	title: __( 'Photoswipe Gallery' ),
	description: __( 'Display multiple images in a gallery with PhotoSwipe plugin.' ),
	icon: 'format-gallery',
	category: 'common',
	keywords: [ __( 'images' ), __( 'photos' ), __( 'PhotoSwipe' ) ],
	attributes: blockAttributes,
	supports: {
		align: false,
		multiple: false,
	},

	transforms: {
		from: [
			{
				type: 'block',
				isMultiBlock: true,
				blocks: [ 'core/image' ],
				transform: ( attributes ) => {
					const validImages = filter( attributes, ( { id, url } ) => id && url );
					if ( validImages.length > 0 ) {
						return createBlock( 'radiium/photoswipe-gallery', {
							images: validImages.map( ( { id, url, alt, caption } ) => ( { id, url, alt, caption } ) ),
							ids: validImages.map( ( { id } ) => id ),
						} );
					}
					return createBlock( 'radiium/photoswipe-gallery' );
				},
			},
			{
				type: 'shortcode',
				tag: 'photoswipe-gallery',
				attributes: {
					images: {
						type: 'array',
						shortcode: ( { named: { ids } } ) => {
							return parseShortcodeIds( ids ).map( ( id ) => ( {
								id,
							} ) );
						},
					},
					ids: {
						type: 'array',
						shortcode: ( { named: { ids } } ) => {
							return parseShortcodeIds( ids );
						},
					},
					linkTo: {
						type: 'string',
						shortcode: ( { named: { link = 'attachment' } } ) => {
							// console.log('linkTo shortcode', named);
							return link === 'file' ? 'media' : link;
						},
					},
				},
			},
			{
				// When created by drag and dropping multiple files on an insertion point
				type: 'files',
				isMatch( files ) {
					return files.length !== 1 && every( files, ( file ) => file.type.indexOf( 'image/' ) === 0 );
				},
				transform( files, onChange ) {
					const block = createBlock( name, {
						images: files.map( ( file ) => pickRelevantMediaFiles( {
							url: createBlobURL( file ),
						} ) ),
					} );
					mediaUpload( {
						filesList: files,
						onFileChange: ( images ) => {
							const imagesAttr = images.map(
								pickRelevantMediaFiles
							);
							onChange( block.clientId, {
								ids: map( imagesAttr, 'id' ),
								images: imagesAttr,
							} );
						},
						allowedTypes: [ 'image' ],
					} );
					return block;
				},
			},
		],
		to: [
			{
				type: 'block',
				blocks: [ 'core/image' ],
				transform: ( { images } ) => {
					if ( images.length > 0 ) {
						return images.map( ( { id, url, alt, caption } ) => createBlock( 'core/image', { id, url, alt, caption } ) );
					}
					return createBlock( 'core/image' );
				},
			},
		],
	},

	edit,

	save( { attributes } ) {
		const { images } = attributes;
		return createElement('div', { 'className': 'galleryWrapper' },
			createPhotoGallery(images),
			createPhotoswipeGallery()
		);
	}
};

wp.blocks.registerBlockType( 'radiium/photoswipe-gallery', settings);

const getSize = (sizesString) => {
	const parsedSizes = JSON.parse(sizesString);
	if (parsedSizes) {
		const width = parsedSizes.large.width;
		const height = parsedSizes.large.height;
		return width + 'x' + height;
	}
	return '1024x1024';
};


const createPhotoGallery = (images) => {
	return createElement('div', {
			'className': 'galleryContainer',
			'itemscope': '',
			'itemtype': 'http://schema.org/ImageGallery'
		},
		images.map(function( image ) {

			const url = image.url;
			const size = getSize(image.sizes);
			const sizes = image.sizes || {};

			return createElement('figure', {
					className: 'galleryItem',
				},
				createElement('a', {
						'className': 'galleryLink',
						'href': url,
						'itemprop': 'contentUrl',
						'data-size': size
					},
					createElement( 'img', {
						'className': 'galleryImg',
						'src': url,
						'alt': 'Imgage de clichesnicolas.com',
						'draggable': false,
						'itemprop': 'thumbnail',
						'data-link': image.link,
						'data-id': image.id,
						'data-sizes-obj': sizes
					})
				)
			)
		})
	);
};

const createPhotoswipeGallery = () => {
	return createElement('div', {
			'className': 'pswp',
			'tabindex': '-1',
			'role': 'dialog',
			'aria-hidden': 'true'
		},
		createElement('div', { 'className': 'pswp__bg'}),
		createElement('div', { 'className': 'pswp__scroll-wrap'},
			createElement('div', { 'className': 'pswp__container'},
				createElement('div', { 'className': 'pswp__item'}),
				createElement('div', { 'className': 'pswp__item'}),
				createElement('div', { 'className': 'pswp__item'}),
			),

			createElement('div', { 'className': 'pswp__ui pswp__ui--hidden'},
				createElement('div', { 'className': 'pswp__top-bar'},

					createElement('div', { 'className': 'pswp__counter'}),
					createElement('button', {
						'className': 'pswp__button pswp__button--close',
						'title': 'Close (Esc)'
					}),

					createElement('button', {
						'className': 'pswp__button pswp__button--share',
						'title': 'Share'
					}),
					createElement('button', {
						'className': 'pswp__button pswp__button--fs',
						'title': 'Toggle fullscreen'
					}),
					createElement('button', {
						'className': 'pswp__button pswp__button--zoom',
						'title': 'Zoom in/out'
					}),

					createElement('button', { 'className': 'pswp__preloader'},
						createElement('div', { 'className': 'pswp__preloader__icn'},
							createElement('div', { 'className': 'pswp__preloader__cut'},
								createElement('div', { 'className': 'pswp__preloader__donut'})
							),
						)
					),
				),

				createElement('div', { 'className': 'pswp__share-modal pswp__share-modal--hidden pswp__single-tap'},
					createElement('div', { 'className': 'pswp__share-tooltip'})
				),
				createElement('button', {
					'className': 'pswp__button pswp__button--arrow--left',
					'title': 'Previous (arrow left)'
				}),
				createElement('button', {
					'className': 'pswp__button pswp__button--arrow--right',
					'title': 'Next (arrow right)'
				}),
				createElement('div', { 'className': 'pswp__caption'},
					createElement('div', { 'className': 'pswp__caption__center'})
				)
			)
		)
	);
};
