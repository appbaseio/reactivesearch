import React, { Component } from 'react';
import { withGoogleMap, GoogleMap } from 'react-google-maps';
import MarkerClusterer from 'react-google-maps/lib/components/addons/MarkerClusterer';
import { getInnerKey } from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';

import Dropdown from '@appbaseio/reactivesearch/lib/components/shared/Dropdown';

import ReactiveMap from './ReactiveMap';
import GoogleMapMarkers from './GoogleMapMarkers';

const Standard = require('./addons/styles/Standard');
const BlueEssence = require('./addons/styles/BlueEssence');
const BlueWater = require('./addons/styles/BlueWater');
const FlatMap = require('./addons/styles/FlatMap');
const LightMonochrome = require('./addons/styles/LightMonochrome');
const MidnightCommander = require('./addons/styles/MidnightCommander');
const UnsaturatedBrowns = require('./addons/styles/UnsaturatedBrowns');

const MapComponent = withGoogleMap((props) => {
	const { children, onMapMounted, ...allProps } = props;

	return (
		<GoogleMap ref={onMapMounted} {...allProps}>
			{children}
		</GoogleMap>
	);
});

class ReactiveGoogleMap extends Component {
	constructor(props) {
		super(props);

		this.mapStyles = [
			{ label: 'Standard', value: Standard },
			{ label: 'Blue Essence', value: BlueEssence },
			{ label: 'Blue Water', value: BlueWater },
			{ label: 'Flat Map', value: FlatMap },
			{ label: 'Light Monochrome', value: LightMonochrome },
			{ label: 'Midnight Commander', value: MidnightCommander },
			{ label: 'Unsaturated Browns', value: UnsaturatedBrowns },
		];

		const currentMapStyle
			= this.mapStyles.find(style => style.label === props.defaultMapStyle)
			|| this.mapStyles[0];

		this.state = {
			currentMapStyle,
			mapRef: null,
			updaterKey: 0,
		};
	}

	componentDidUpdate(prevProps) {
		if (this.props.defaultMapStyle !== prevProps.defaultMapStyle) {
			this.handleStyleChange(this.props.defaultMapStyle);
		}
	}

	handleStyleChange = (newStyle) => {
		this.setState(prevState => ({
			currentMapStyle:
				this.mapStyles.find(style => style.label === newStyle) || this.mapStyles[0],
			updaterKey: prevState.updaterKey + 1,
		}));
	};

	handleUpdaterKey = () => {
		this.setState(prevState => ({
			updaterKey: prevState.updaterKey + 1,
		}));
	};

	setMapStyle = (currentMapStyle) => {
		this.setState(prevState => ({
			currentMapStyle,
			updaterKey: prevState.updaterKey + 1,
		}));
	};

	renderMap = (params) => {
		if (typeof window === 'undefined' || (window && typeof window.google === 'undefined')) {
			return null;
		}

		const style = {
			width: '100%',
			height: '100%',
			position: 'relative',
		};

		const markerProps = {
			resultsToRender: params.resultsToRender,
			getPosition: params.getPosition,
			renderData: params.renderData,
			defaultPin: params.defaultPin,
			autoClosePopover: params.autoClosePopover,
			handlePreserveCenter: params.handlePreserveCenter,
			onPopoverClick: params.onPopoverClick,
			markerProps: this.props.markerProps,
		};

		return (
			<div style={style}>
				<MapComponent
					containerElement={<div style={style} />}
					mapElement={<div style={{ height: '100%' }} />}
					onMapMounted={(ref) => {
						this.setState({
							mapRef: ref,
						});
						if (params.innerRef && ref) {
							const map = Object.values(ref.context)[0];
							const mapRef = { ...ref, map };
							params.innerRef(mapRef);
						}
					}}
					zoom={params.zoom}
					center={params.center}
					{...params.mapProps}
					onIdle={params.handleOnIdle}
					onZoomChanged={params.handleZoomChange}
					onDragEnd={params.handleOnDragEnd}
					options={{
						styles: this.state.currentMapStyle.value,
						...getInnerKey(this.props.mapProps, 'options'),
					}}
				>
					{this.props.showMarkers && this.props.showMarkerClusters ? (
						<MarkerClusterer averageCenter enableRetinaIcons gridSize={60}>
							<GoogleMapMarkers {...markerProps} />
						</MarkerClusterer>
					) : (
						<React.Fragment>
							{this.props.showMarkers && <GoogleMapMarkers {...markerProps} />}
						</React.Fragment>
					)}
					{this.props.showMarkers && this.props.markers}
					{params.renderSearchAsMove()}
				</MapComponent>
				{this.props.showMapStyles ? (
					<div
						style={{
							position: 'absolute',
							top: 10,
							right: 46,
							width: 120,
							zIndex: window.google.maps.Marker.MAX_ZINDEX + 1,
						}}
					>
						<Dropdown
							innerClass={this.props.innerClass}
							items={this.mapStyles}
							onChange={this.setMapStyle}
							selectedItem={this.state.currentMapStyle}
							keyField="label"
							returnsObject
							small
						/>
					</div>
				) : null}
			</div>
		);
	};

	render() {
		return (
			<ReactiveMap
				{...this.props}
				renderMap={this.renderMap}
				mapRef={this.state.mapRef}
				updaterKey={this.state.updaterKey}
			/>
		);
	}
}

ReactiveGoogleMap.propTypes = {
	autoCenter: types.bool,
	center: types.location,
	className: types.string,
	componentId: types.stringRequired,
	dataField: types.stringRequired,
	defaultCenter: types.location,
	defaultMapStyle: types.string,
	defaultPin: types.string,
	defaultQuery: types.func,
	defaultZoom: types.number,
	innerClass: types.style,
	innerRef: types.func,
	loader: types.title,
	mapProps: types.props,
	markerProps: types.props,
	markers: types.children,
	renderAllData: types.func,
	renderData: types.func,
	onPageChange: types.func,
	onPopoverClick: types.func,
	pages: types.number,
	pagination: types.bool,
	react: types.react,
	searchAsMove: types.bool,
	showMapStyles: types.bool,
	showMarkerClusters: types.bool,
	showMarkers: types.bool,
	showSearchAsMove: types.bool,
	size: types.number,
	sortBy: types.sortBy,
	stream: types.bool,
	streamAutoCenter: types.bool,
	style: types.style,
	URLParams: types.bool,
	defaultRadius: types.number,
	unit: types.string,
	autoClosePopover: types.bool,
	renderMap: types.func,
	updaterKey: types.number,
	mapRef: types.any, // eslint-disable-line
};

ReactiveGoogleMap.defaultProps = {
	autoClosePopover: true,
	size: 10,
	style: {},
	className: null,
	pages: 5,
	pagination: false,
	defaultMapStyle: 'Standard',
	autoCenter: false,
	streamAutoCenter: false,
	defaultZoom: 8,
	mapProps: {},
	markerProps: {},
	markers: null,
	showMapStyles: false,
	showSearchAsMove: true,
	searchAsMove: false,
	showMarkers: true,
	showMarkerClusters: true,
	unit: 'mi',
	defaultRadius: 100,
};

export default ReactiveGoogleMap;
