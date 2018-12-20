/**
 * External Dependencies
 */
// import { filter, pick, map, get } from 'lodash';
import filter from 'lodash/filter';
import pick from 'lodash/pick';
import map from 'lodash/map';
import get from 'lodash/get';

import classnames from 'classnames';
/**
 * WordPress dependencies
 *
import { Component, Fragment } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import {
	IconButton,
	DropZone,
	FormFileUpload,
	PanelBody,
	RangeControl,
	SelectControl,
	ToggleControl,
	Toolbar,
	withNotices,
} from '@wordpress/components';
import {
	BlockControls,
	MediaUpload,
	MediaPlaceholder,
	InspectorControls,
	mediaUpload,
} from '@wordpress/editor';
*/

const { Component, Fragment } = wp.element;
const { __, sprintf } = wp.i18n;
const {
	IconButton,
	DropZone,
	FormFileUpload,
	PanelBody,
	RangeControl,
	SelectControl,
	ToggleControl,
	Toolbar,
	withNotices,
} = wp.components;
const {
	BlockControls,
	MediaUpload,
	MediaPlaceholder,
	InspectorControls,
	mediaUpload,
} = wp.editor;

const { compose } = wp.compose;
const { withSelect } = wp.data;

/**
 * Internal dependencies
 */
import CustomGalleryImage from './gallery-image';
import Inspector from './inspector';


const MAX_COLUMNS = 8;
const ALLOWED_MEDIA_TYPES = [ 'image' ];

export function defaultColumnsNumber( attributes ) {
	return Math.min( 3, attributes.images.length );
}

export const pickRelevantMediaFiles = ( image ) => {
	const imageProps = pick( image, [ 'alt', 'id', 'caption', 'sizes' ] );
	imageProps.url = get( image, [ 'sizes', 'large', 'url' ] ) || get( image, [ 'media_details', 'sizes', 'large', 'source_url' ] ) || image.url;

	console.log('sizes', imageProps);

	return imageProps;
};

class CustomGalleryEdit extends Component {
	constructor() {
		super( ...arguments );

		this.onSelectImage = this.onSelectImage.bind( this );
		this.onSelectImages = this.onSelectImages.bind( this );
		this.onRemoveImage = this.onRemoveImage.bind( this );
		this.setImageAttributes = this.setImageAttributes.bind( this );
		this.addFiles = this.addFiles.bind( this );
		this.uploadFromFiles = this.uploadFromFiles.bind( this );
		this.setAttributes = this.setAttributes.bind( this );

		this.state = {
			selectedImage: null,
		};
	}

	setAttributes( attributes ) {
		if ( attributes.ids ) {
			throw new Error( 'The "ids" attribute should not be changed directly. It is managed automatically when "images" attribute changes' );
		}

		if ( attributes.images ) {
			attributes = {
				...attributes,
				ids: map( attributes.images, 'id' ),
			};
		}

		this.props.setAttributes( attributes );
	}

	onSelectImage( index ) {
		return () => {
			if ( this.state.selectedImage !== index ) {
				this.setState( {
					selectedImage: index,
				} );
			}
		};
	}

	onRemoveImage( index ) {
		return () => {
			const images = filter( this.props.attributes.images, ( img, i ) => index !== i );
			const { columns } = this.props.attributes;
			this.setState( { selectedImage: null } );
			this.setAttributes( {
				images,
				columns: columns ? Math.min( images.length, columns ) : columns,
			} );
		};
	}

	onSelectImages( images ) {
		this.setAttributes( {
			images: images.map( ( image ) => pickRelevantMediaFiles( image ) ),
		} );
	}

	setImageAttributes( index, attributes ) {
		const { attributes: { images } } = this.props;
		const { setAttributes } = this;
		if ( ! images[ index ] ) {
			return;
		}
		setAttributes( {
			images: [
				...images.slice( 0, index ),
				{
					...images[ index ],
					...attributes,
				},
				...images.slice( index + 1 ),
			],
		} );
	}

	uploadFromFiles( event ) {
		this.addFiles( event.target.files );
	}

	addFiles( files ) {
		const currentImages = this.props.attributes.images || [];
		const { noticeOperations } = this.props;
		const { setAttributes } = this;
		mediaUpload( {
			allowedTypes: ALLOWED_MEDIA_TYPES,
			filesList: files,
			onFileChange: ( images ) => {
				const imagesNormalized = images.map( ( image ) => pickRelevantMediaFiles( image ) );
				setAttributes( {
					images: currentImages.concat( imagesNormalized ),
				} );
			},
			onError: noticeOperations.createErrorNotice,
		} );
	}

	componentDidUpdate( prevProps ) {
		// Deselect images when deselecting the block
		if ( ! this.props.isSelected && prevProps.isSelected ) {
			this.setState( {
				selectedImage: null,
				captionSelected: false,
			} );
		}
	}

	render() {
		const {
			attributes,
			isSelected,
			className,
			noticeOperations,
			noticeUI } = this.props;

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

		const itemStyle = (imageShapeType === 'custom' && imageShapeValue)
			? { clipPath: imageShapeValue }
			: {};

		const dropZone = (
			<DropZone
				onFilesDrop={ this.addFiles }
			/>
		);

		const controls = (
			<BlockControls>
				{ !! images.length && (
					<Toolbar>
						<MediaUpload
							onSelect={ this.onSelectImages }
							allowedTypes={ ALLOWED_MEDIA_TYPES }
							multiple
							gallery
							value={ images.map( ( img ) => img.id ) }
							render={ ( { open } ) => (
								<IconButton
									className="components-toolbar__control"
									label={ __( 'Edit Gallery' ) }
									icon="edit"
									onClick={ open }
								/>
							) }
						/>
					</Toolbar>
				) }
			</BlockControls>
		);

		if ( images.length === 0 ) {
			return (
				<Fragment>
					{ controls }
					<MediaPlaceholder
						icon="format-gallery"
						className={ className }
						labels={ {
							title: __( 'Gallery' ),
							instructions: __( 'Drag images, upload new ones or select files from your library.' ),
						} }
						onSelect={ this.onSelectImages }
						accept="image/*"
						allowedTypes={ ALLOWED_MEDIA_TYPES }
						multiple
						notices={ noticeUI }
						onError={ noticeOperations.createErrorNotice }
					/>
				</Fragment>
			);
		}

		return (
			<Fragment>
				{ controls }
				<Inspector { ...this.props } />
				{ noticeUI }
				{ /* align${ align } */ }
				<div className={ galleryClass }>
					{ dropZone }
					{ images.map( ( img, index ) => {

						return (
							<CustomGalleryImage
								styles={ itemStyle }
								key={ img.id || img.url }
								url={ img.url }
								alt={ img.alt }
								id={ img.id }
								isSelected={ isSelected && this.state.selectedImage === index }
								onRemove={ this.onRemoveImage( index ) }
								onSelect={ this.onSelectImage( index ) }
								setAttributes={ ( attrs ) => this.setImageAttributes( index, attrs ) }
								caption={ img.caption }
								showCaptions={ showCaptions }
							/>
						);
					} ) }
				</div>

				{ isSelected &&
						<div className="formUploadBtn has-add-item-button">
							<FormFileUpload
								multiple
								isLarge
								className="block-library-gallery-add-item-button"
								onChange={ this.uploadFromFiles }
								accept="image/*"
								icon="insert">
								{ __( 'Upload an image' ) }
							</FormFileUpload>
						</div>
					}
			</Fragment>
		);
	}
}

export default withNotices( CustomGalleryEdit );
