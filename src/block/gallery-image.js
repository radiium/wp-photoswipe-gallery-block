/**
 * External Dependencies
 */
import classnames from 'classnames';

/**
 * WordPress Dependencies
 *
import { Component, Fragment } from '@wordpress/element';
import { IconButton, Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { BACKSPACE, DELETE } from '@wordpress/keycodes';
import { withSelect } from '@wordpress/data';
import { RichText } from '@wordpress/editor';
import { isBlobURL } from '@wordpress/blob';
*/
const { Component, Fragment } = wp.element;
const { IconButton, Spinner } = wp.components;
const { __ } = wp.i18n;
const { BACKSPACE, DELETE } = wp.keycodes;
const { withSelect } = wp.data;
const { RichText } = wp.editor;
const { isBlobURL } = wp.blob;

class CustomGalleryImage extends Component {
	constructor() {
		super( ...arguments );

		this.onImageClick = this.onImageClick.bind( this );
		this.onSelectCaption = this.onSelectCaption.bind( this );
		this.onKeyDown = this.onKeyDown.bind( this );
		this.bindContainer = this.bindContainer.bind( this );

		this.state = {
			captionSelected: false,
		};
	}

	bindContainer( ref ) {
		this.container = ref;
	}

	onSelectCaption(e) {
		if ( ! this.state.captionSelected ) {
			this.setState( {
				captionSelected: true,
			} );
		}

		if ( ! this.props.isSelected ) {
			this.props.onSelect();
		}
	}

	onImageClick() {
		if ( ! this.props.isSelected ) {
			this.props.onSelect();
		}

		if ( this.state.captionSelected ) {
			this.setState( {
				captionSelected: false,
			} );
		}
	}

	onKeyDown( event ) {
		if (
			this.container === document.activeElement &&
			this.props.isSelected && [ BACKSPACE, DELETE ].indexOf( event.keyCode ) !== -1
		) {
			event.stopPropagation();
			event.preventDefault();
			this.props.onRemove();
		}
	}

	componentDidUpdate( prevProps ) {
		const { isSelected, image, url } = this.props;
		if ( image && ! url ) {
			this.props.setAttributes( {
				url: image.source_url,
				alt: image.alt_text,
			} );
		}

		// unselect the caption so when the user selects other image and comeback
		// the caption is not immediately selected
		if ( this.state.captionSelected && ! isSelected && prevProps.isSelected ) {
			this.setState( {
				captionSelected: false,
			} );
		}
	}

	render() {
		const {
			url,
			alt,
			id,
			className,
			isSelected,
			caption,
			showCaptions,
			onRemove,
			setAttributes,
			styles,
		} = this.props;

		const itemClass = classnames('gallery-item', {
			'is-selected': isSelected,
			'is-transient': isBlobURL( url )
		} );

		const imgClass = classnames('gallery-img');
		const captionClass = classnames('gallery-caption');
		const captionsStyle = {
			display: !!showCaptions ? 'table' : 'none'
		};

		const img = (
			<Fragment>
				<img
					className={ imgClass }
					src={ url }
					alt={ alt }
					data-id={ id }
					tabIndex="0"
					onClick={ this.onImageClick }
					onKeyDown={ this.onImageClick }
				/>
				{ isBlobURL( url ) && <Spinner /> }
				{ isSelected &&
					<div
					className="selectedOverlay"
					onClick={ this.onImageClick }
					>
					</div>
				}
			</Fragment>
		);

		return (
			<figure
				className={ itemClass }
				style={ styles }
				tabIndex="-1"
				onKeyDown={ this.onKeyDown }
				ref={ this.bindContainer }>

				{ isSelected &&
					<div className="gallery-item-remove">
					<IconButton
						icon="no-alt"
						onClick={ onRemove }
						className="remove-btn"
						label={ __( 'Remove Image' ) }
					/>
					</div>
				}

				{ img }

				{ (! RichText.isEmpty( caption ) || isSelected) && showCaptions ? (
					<RichText
						className={ captionClass }
						style= { captionsStyle }
						tagName="figcaption"
						placeholder={ __( 'Write caption…' ) }
						value={ caption }
						isSelected={ this.state.captionSelected }
						onChange={ ( newCaption ) => setAttributes( { caption: newCaption } ) }
						unstableOnFocus={ this.onSelectCaption }
						inlineToolbar
					/>
				) : null }
			</figure>
		);
	}
}

export default withSelect( ( select, ownProps ) => {
	const { getMedia } = select( 'core' );
	const { id } = ownProps;
	return {
		image: id ? getMedia( id ) : null,
	};
} )( CustomGalleryImage );
