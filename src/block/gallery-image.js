/**
 * External Dependencies
 */
import classnames from 'classnames';

/**
 * WordPress Dependencies
 */
import { Component, Fragment } from '@wordpress/element';
import { IconButton, Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { BACKSPACE, DELETE } from '@wordpress/keycodes';
import { withSelect } from '@wordpress/data';
import { isBlobURL } from '@wordpress/blob';

class GalleryImage2 extends Component {
	constructor() {
		super( ...arguments );

		this.onImageClick = this.onImageClick.bind( this );
		this.onKeyDown = this.onKeyDown.bind( this );
		this.bindContainer = this.bindContainer.bind( this );

		this.state = {};
	}

	bindContainer( ref ) {
		this.container = ref;
	}

	onImageClick() {
		if ( ! this.props.isSelected ) {
			this.props.onSelect();
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
		const { image, url } = this.props;
		if ( image && ! url ) {
			this.props.setAttributes( {
				url: image.source_url,
				alt: image.alt_text,
			} );
		}
	}

	render() {
		const { url, alt, id, sizes, linkTo, link, isSelected,
			onRemove, 'aria-label': ariaLabel } = this.props;

		let href;

		switch ( linkTo ) {
			case 'media':
				href = url;
				break;
			case 'attachment':
				href = link;
				break;
		}

		const img = (
			<Fragment>
				<img
					src={ url }
					alt={ alt }
					data-sizes-obj={ sizes }
					data-id={ id }
					onClick={ this.onImageClick }
					tabIndex="0"
					onKeyDown={ this.onImageClick }
					aria-label={ ariaLabel }
				/>
				{ isBlobURL( url ) && <Spinner /> }
			</Fragment>
			/* eslint-enable jsx-a11y/no-noninteractive-element-interactions */
		);

		const className = classnames( {
			'is-transient': isBlobURL( url ),
		} );

		return (
			<figure className={ className } tabIndex="-1" onKeyDown={ this.onKeyDown } ref={ this.bindContainer }>
				{ isSelected &&
					<div className="block-library-gallery-item__inline-menu">
						<IconButton
							icon="no-alt"
							onClick={ onRemove }
							className="blocks-gallery-item__remove"
							label={ __( 'Remove Image' ) }
						/>
					</div>
				}
				{ href ? <a href={ href }>{ img }</a> : img }
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
} )( GalleryImage2 );
