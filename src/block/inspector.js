/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const { InspectorControls } = wp.editor;
const {
    PanelBody,
    RangeControl,
    TabPanel,
    ToggleControl,
    SelectControl,
    TextControl,
    Dashicon,
    } = wp.components;

const layoutOptions = [
    { value: 'stack', label: __( 'Stack' ) },
    { value: 'row', label: __( 'Row' ) },
    { value: 'column', label: __( 'Column' ) },
    { value: 'grid', label: __( 'Grid' ) },
];

const imageShapeTypeOptions = [
    { value: 'custom', label: __( 'Custom' ) },
    { value: 'square', label: __( 'Square' ) },
    { value: 'circle', label: __( 'Circle' ) },
    { value: 'triangle', label: __( 'Triangle' ) },
    { value: 'rhombus', label: __( 'Rhombus' ) },
    { value: 'pentagon', label: __( 'Pentagon' ) },
    { value: 'hexagon', label: __( 'Hexagon' ) },
    { value: 'octagon', label: __( 'Octagon' ) },
    { value: 'rablet', label: __( 'Rablet' ) },
    { value: 'star', label: __( 'Star' ) },
    { value: 'cross', label: __( 'Cross' ) },
    { value: 'frame', label: __( 'Frame' ) },
    { value: 'stupid', label: __( 'Stupid' ) },
];

/**
 * Inspector controls
 */
class Inspector extends Component {

	constructor( props ) {
		super( ...arguments );

        // Layout Settings
        this.setLayoutType = this.setLayoutType.bind( this );
        this.setLayoutStackDim = this.setLayoutStackDim.bind( this );
        this.setLayoutRowDim = this.setLayoutRowDim.bind( this );
        this.setLayoutColumnDim = this.setLayoutColumnDim.bind( this );
        this.setLayoutGridDim = this.setLayoutGridDim.bind( this );

        // Layout Items Settings
        this.setImageCrop = this.setImageCrop.bind( this );
        this.setImageShapeType = this.setImageShapeType.bind( this );
        this.setImageShapeValue = this.setImageShapeValue.bind( this );

        // General Settings
        this.setGalleryPadding = this.setGalleryPadding.bind( this );
        this.setGalleryPaddingMobile = this.setGalleryPaddingMobile.bind( this );
        this.setGutter = this.setGutter.bind( this );
        this.setGutterMobile = this.setGutterMobile.bind( this );
    }

    // Layout Settings
    setLayoutType( value ) {
        this.props.setAttributes( { layoutType: value } );
    }

    setLayoutStackDim( value ) {
        this.props.setAttributes( { layoutStackDim: value } );
    }

    setLayoutRowDim( value ) {
        this.props.setAttributes( { layoutRowDim: value } );
    }

    setLayoutColumnDim( value ) {
        this.props.setAttributes( { layoutColumnDim: value } );
    }

    setLayoutGridDim( value ) {
        this.props.setAttributes( { layoutGridDim: value } );
    }

    // Layout Items Settings
    setImageCrop( value ) {
        this.props.setAttributes( { imageCrop: value } );
    }

    setImageShapeType( value ) {
        this.props.setAttributes( { imageShapeType: value } );
    }

    setImageShapeValue( value ) {
        this.props.setAttributes( { imageShapeValue: value } );
    }

    // General Settings
    setGalleryPadding( value ) {
        this.props.setAttributes( { galleryPadding: value } );
    }

    setGalleryPaddingMobile( value ) {
        this.props.setAttributes( { galleryPaddingMobile: value } );
    }

    setGutter( value ) {
		this.props.setAttributes( { gutter: value } );
    }

    setGutterMobile( value ) {
		this.props.setAttributes( { gutterMobile: value } );
    }

    // Conditional helps
    getShowCaptionsHelp( checked ) {
		return checked ? __( 'Showing captions for each media item.' ) : __( 'Toggle to show media captions.' );
    }

    getImageCropHelp( checked ) {
		return checked ? __( 'Cropping images with a shape' ) : __( 'Toggle to crop images with a shape.' );
    }


	componentDidUpdate( prevProps ) {
	}

	render() {
		const {
			attributes,
            isSelected,
            setAttributes
        } = this.props;

		const {
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
            showCaptions
        } = attributes;

		return (
			isSelected && (
				<Fragment>
				<InspectorControls>

                <PanelBody
                    title={ __( 'General Settings' ) }
                    initialOpen={ true }>
                        <SelectControl
                            label="Layout"
                            value={ layoutType }
                            options={ layoutOptions }
                            onChange={ this.setLayoutType }
                        />

                        { /* Stack layout Dimension */
                        (layoutType === 'stack') &&
                            <RangeControl
                                label={ __( 'Stack width' ) }
                                value={ layoutStackDim }
                                onChange={ this.setLayoutStackDim }
                                help={ __( 'The width of gallery items in pixels' ) }
                                min={ 100 }
                                max={ 300 }
                                step={ 5 }
                            />
                        }

                        { /* Row layout Dimension */
                        (layoutType === 'row') &&
                            <RangeControl
                                label={ __( 'Row height' ) }
                                value={ layoutRowDim }
                                onChange={ this.setLayoutRowDim }
                                help={ __( 'The height of gallery items in pixels' ) }
                                min={ 100 }
                                max={ 300 }
                                step={ 5 }
                            />
                        }

                        { /* Column layout Dimension */
                        (layoutType === 'column') &&
                            <RangeControl
                                label={ __( 'Column max width' ) }
                                value={ layoutColumnDim }
                                onChange={ this.setLayoutColumnDim }
                                help={ __( 'The maximum width of gallery items in pixels' ) }
                                min={ 100 }
                                max={ 300 }
                                step={ 5 }
                            />
                        }

                        { /* Grid layout Dimension */
                        (layoutType === 'grid') &&
                            <RangeControl
                                label={ __( 'Grid item width and height' ) }
                                value={ layoutGridDim }
                                onChange={ this.setLayoutGridDim }
                                help={ __( 'Item width and height of gallery items in pixels' ) }
                                min={ 100 }
                                max={ 300 }
                                step={ 5 }
                            />
                        }

                        { /* Padding/Gutter for desktop and mobile settings */ }
                        <TabPanel
                            className="desktop-mobile-panel"
                            initialTabName="desk"
                            activeClass="tab-panel-item-active"
                            tabs={ [
                                {
                                    name: 'desk',
                                    title: <div><Dashicon icon="desktop" />{ __( 'Desktop' ) }</div>,
                                    className: 'tab-panel-item'
                                },
                                    {
                                    name: 'mobile',
                                    title:<div><Dashicon icon="tablet" />{ __( 'Mobile' ) }</div>,
                                    className: 'tab-panel-item'
                                },
                            ] }>
                            {
                                ( tab ) => {
                                    if ('desk' === tab.name) {
                                        return (
                                            <div class="tab-panel-content">
                                            <div></div>
                                            <RangeControl
                                                label={ __( 'Gallery padding' ) }
                                                value={ galleryPadding }
                                                onChange={ this.setGalleryPadding }
                                                help={ __( 'Set spacing arround gallery' ) }
                                                min={ 0 }
                                                max={ 100 }
                                                step={ 5 }
                                            />

                                            <RangeControl
                                                label={ __( 'Gutter' ) }
                                                value={ gutter }
                                                onChange={ this.setGutter }
                                                help={ __( 'Set spacing between item' ) }
                                                min={ 0 }
                                                max={ 100 }
                                                step={ 5 }
                                            />
                                            </div>
                                        );
                                    } else if ('mobile' === tab.name) {
                                        return (
                                            <div class="tab-panel-content">
                                            <RangeControl
                                                label={ __( 'Gallery padding mobile' ) }
                                                value={ galleryPaddingMobile }
                                                onChange={ this.setGalleryPaddingMobile }
                                                help={ __( 'Set spacing arround mobile gallery' ) }
                                                min={ 0 }
                                                max={ 50 }
                                                step={ 5 }
                                            />

                                            <RangeControl
                                                label={ __( 'Gutter mobile' ) }
                                                value={ gutterMobile }
                                                onChange={ this.setGutterMobile }
                                                help={ __( 'Set spacing between mobile item' ) }
                                                min={ 0 }
                                                max={ 50 }
                                                step={ 5 }
                                            />
                                            </div>
                                        );
                                    }
                                }
                            }
                        </TabPanel>

                        { /* Show/Hide images captions */ }
                        <ToggleControl
                            label={ __( 'Captions' ) }
                            checked={ !! showCaptions }
                            onChange={ () => setAttributes( {  showCaptions: !showCaptions } ) }
                            help={ this.getShowCaptionsHelp }
                        />

                    </PanelBody>

                    { /* Crop images in a square or a clip-path shape */ }
                    <PanelBody
                        title={ __( 'Item Settings' ) }
                        initialOpen={ true }>

                        <ToggleControl
                            label={ __( 'Crop images' ) }
                            checked={ !! imageCrop }
                            onChange={ () => setAttributes( {  imageCrop: !imageCrop } ) }
                            help={ this.getImageCropHelp }
                        />

                        { imageCrop && <SelectControl
                            label="Shape type"
                            value={ imageShapeType }
                            options={ imageShapeTypeOptions }
                            onChange={ this.setImageShapeType }
                            help={ __( 'Select type of shape' ) }

                        />}

                        { /* Add custom clip-path rule */
                        (imageCrop && imageShapeType === 'custom') &&
                            <TextControl
                                label="Custom css clip-path rule"
                                value={ imageShapeValue }
                                onChange={ this.setImageShapeValue }
                                help={ __( 'Paste you custom css clip-path rules (without clip-path) see: http://bennettfeely.com/clippy/' ) }
                            />
                        }
                    </PanelBody>

				</InspectorControls>
				</Fragment>
			)
		)
	}
};

export default Inspector;
