import { filter, map, tap, chain, value } from 'lodash';
import { Component, Fragment } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import {
	Icon,
	IconButton,
	DropZone,
	PanelBody,
	SelectControl,
	Toolbar,
	withNotices
} from '@wordpress/components';

import {
	BlockControls,
	MediaUpload,
	MediaUploadCheck,
	MediaPlaceholder,
	InspectorControls,
	// mediaUpload,
} from '@wordpress/editor';



import CustomMediaUpload from './custom-media-upload';
import GalleryImage2 from './gallery-image';
import {
	ALLOWED_MEDIA_TYPES,
	linkOptions,
	pickRelevantMediaFiles } from './utils';


class GalleryEdit extends Component {
	constructor() {
		super( ...arguments );

		this.onSelectImage = this.onSelectImage.bind( this );
		this.onSelectImages = this.onSelectImages.bind( this );
		this.setLinkTo = this.setLinkTo.bind( this );
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
			this.setState( { selectedImage: null } );
			this.setAttributes({ images });
		};
	}

	onSelectImages( images ) {
		// console.log('onSelectImages', images);
		this.setAttributes( {
			images: images.map( ( image ) => pickRelevantMediaFiles( image ) ),
		} );

		/*
		console.log('editor-post-title', $('.editor-post-title')[0].click())
		$('.editor-block-list__layout')
			.blur()
			.focusout();
			document.activeElement.blur();
		*/
	}

	setLinkTo( value ) {
		this.setAttributes( { linkTo: value } );
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
		const { images, linkTo } = attributes;
		const dropZone = (<DropZone onFilesDrop={ this.addFiles } />);

		const controls = (
			<BlockControls>
				{ !! images.length && (
					<Toolbar>
						<MediaUploadCheck>
						<CustomMediaUpload
							onSelect={ this.onSelectImages }
							allowedTypes={ ALLOWED_MEDIA_TYPES }
							multiple
							gallery
							value={
								chain(images)
								.map(( img ) => img.id)
								.tap((ar) => {
									return ar;
								})
								.value()
								/*
								images.map( ( img ) => img.id)
								*/
							}
							render={ ( { open } ) => (
								<IconButton
									className="components-toolbar__control"
									label={ __( 'Edit Gallery' ) }
									icon="edit"
									onClick={ open }
								/>
							) }
						/>
						</MediaUploadCheck>
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
							title: __( 'PhotoSwipe Gallery' ),
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
				<InspectorControls>
					<PanelBody title={ __( 'Gallery Settings' ) }>
						<SelectControl
							label={ __( 'Link To' ) }
							value={ linkTo }
							onChange={ this.setLinkTo }
							options={ linkOptions } />
					</PanelBody>
				</InspectorControls>
				{ noticeUI }

				<ul className={ className }>
					{ dropZone }
					{ images.map( ( img, index ) => {
						/* translators: %1$d is the order number of the image, %2$d is the total number of images. */
						const ariaLabel = __( sprintf( 'image %1$d of %2$d in gallery', ( index + 1 ), images.length ) );

						return (
							<li className="blocks-gallery-item" key={ img.id || img.url }>
								<GalleryImage2
									url={ img.url }
									alt={ img.alt }
									id={ img.id }
									sizes={ img.sizes }
									isSelected={ isSelected && this.state.selectedImage === index }
									onRemove={ this.onRemoveImage( index ) }
									onSelect={ this.onSelectImage( index ) }
									setAttributes={ ( attrs ) => this.setImageAttributes( index, attrs ) }
									caption={ img.caption }
									aria-label={ ariaLabel }
								/>
							</li>
						);
					} ) }

					{ isSelected &&
						<div className="addMediaBtnWrapper block-library-gallery-add-item-button">
						<MediaUploadCheck>
						<CustomMediaUpload
							onSelect={ this.onSelectImages }
							allowedTypes={ ALLOWED_MEDIA_TYPES }
							multiple
							gallery
							isLarge
							value={ images.map(( img ) => img.id, 10) }
							render={
								({ open }) => (
								<div className="addMediaBtn" onClick={ open }>
									<Icon icon="edit" />
									<div>{ __( 'Edit Gallery' ) }</div>
								</div>
							) }/>
						</MediaUploadCheck>
						</div>
					}
				</ul>
			</Fragment>
		);

		/*
		*/
	}
}

export default withNotices( GalleryEdit );
