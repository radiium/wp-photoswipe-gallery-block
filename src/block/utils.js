

import { pick, get } from 'lodash';
import { __ } from '@wordpress/i18n';

export const ALLOWED_MEDIA_TYPES = [ 'image' ];

export const linkOptions = [
	{ value: 'attachment', label: __( 'Attachment Page' ) },
	{ value: 'media', label: __( 'Media File' ) },
	{ value: 'none', label: __( 'None' ) },
];


export const parseShortcodeIds = ( ids ) => {
	if ( ! ids ) { return []; }
	return ids.split( ',' ).map( ( id ) => (
		parseInt( id, 10 )
	) );
};

export const pickRelevantMediaFiles = ( image ) => {
	const imageProps = pick( image, [ 'alt', 'id', 'link', 'caption' ] );
	imageProps.url = get( image, [ 'sizes', 'large', 'url' ] ) || get( image, [ 'media_details', 'sizes', 'large', 'source_url' ] ) || image.url;
	imageProps.sizes = JSON.stringify(get(image, ['sizes']));
	return imageProps;
};
