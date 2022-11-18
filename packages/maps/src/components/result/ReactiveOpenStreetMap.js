/** @jsxImportSource @emotion/react */

import { Component } from 'react';
import ReactDOMServer from 'react-dom/server';
import types from '@appbaseio/reactivecore/lib/utils/types';
import { connect, ReactReduxContext } from '@appbaseio/reactivesearch/lib/utils';

import { MapPin, mapPinWrapper } from './addons/styles/MapPin';
import ReactiveMap, { MAP_SERVICES } from './ReactiveMap';

let OpenStreetMap;
let OpenStreetLayer;
let OpenStreetMaker;
let OpenStreetPopup;
let Icon;
let DivIcon;

class ReactiveOpenStreetMap extends Component {
	static contextType = ReactReduxContext;

	constructor(props) {
		super(props);

		this.state = {
			mapRef: null,
		};
	}

	componentDidMount() {
		/* eslint-disable */
		OpenStreetMap = require('react-leaflet').Map;
		OpenStreetLayer = require('react-leaflet').TileLayer;
		OpenStreetMaker = require('react-leaflet').Marker;
		OpenStreetPopup = require('react-leaflet').Popup;
		Icon = require('leaflet').Icon;
		DivIcon = require('leaflet').DivIcon;
		this.forceUpdate();
	}

	getMarkers = ({
		showMarkers,
		renderItem,
		defaultPin,
		onPopoverClick,
		resultsToRender,
		getPosition,
		triggerClickAnalytics,
	}) => {
		if (showMarkers) {
			const markers = resultsToRender.map((item, index) => {
				const position = getPosition(item);
				const openStreetMarkerProps = {
					riseOnHover: true,
					onClick: () => triggerClickAnalytics(index, item._id),
				};

				const openStreetPopupPorops = {
					css: {
						'.leaflet-popup-content-wrapper': {
							borderRadius: '3px !important',
						},
					},
				};

				if (renderItem) {
					const data = renderItem(item);

					if ('label' in data) {
						openStreetMarkerProps.icon = new DivIcon({
							html: ReactDOMServer.renderToStaticMarkup(
								<div css={mapPinWrapper}>
									<MapPin css={{ height: 'auto' }}>{data.label}</MapPin>
									<div
										css={{
											position: 'absolute',
											left: 0,
											width: 0,
											height: 0,
											borderTop: '12px solid white',
											borderRight: '12px solid transparent',
											boxShadow: '0 2px 4px 0 rgba(0,0,0,0.15)',
										}}
									/>
									{onPopoverClick ? (
										<OpenStreetPopup {...openStreetPopupPorops}>
											{onPopoverClick(item)}
										</OpenStreetPopup>
									) : null}
								</div>,
							),
						});
						return (
							<OpenStreetMaker
								key={item._id}
								position={[position.lat, position.lng]}
								{...openStreetMarkerProps}
							>
								{onPopoverClick ? (
									<OpenStreetPopup {...openStreetPopupPorops}>
										{onPopoverClick(item)}
									</OpenStreetPopup>
								) : null}
							</OpenStreetMaker>
						);
					} else if ('icon' in data) {
						openStreetMarkerProps.icon = new Icon({
							iconUrl: data.icon,
						});
						return (
							<OpenStreetMaker
								key={item._id}
								position={[position.lat, position.lng]}
								{...openStreetMarkerProps}
							>
								{onPopoverClick ? (
									<OpenStreetPopup {...openStreetPopupPorops}>
										{onPopoverClick(item)}
									</OpenStreetPopup>
								) : null}
							</OpenStreetMaker>
						);
					}
					openStreetMarkerProps.icon = new DivIcon({
						html: ReactDOMServer.renderToStaticMarkup(data.custom),
					});
					return (
						<OpenStreetMaker
							key={item._id}
							position={[position.lat, position.lng]}
							{...openStreetMarkerProps}
						>
							{onPopoverClick ? (
								<OpenStreetPopup {...openStreetPopupPorops}>
									{onPopoverClick(item)}
								</OpenStreetPopup>
							) : null}
						</OpenStreetMaker>
					);
				} else if (defaultPin) {
					openStreetMarkerProps.icon = new Icon({
						iconUrl: defaultPin,
					});
				}
				return (
					<OpenStreetMaker
						key={item._id}
						position={[position.lat, position.lng]}
						{...openStreetMarkerProps}
					>
						{onPopoverClick ? (
							<OpenStreetPopup {...openStreetPopupPorops}>
								{onPopoverClick(item)}
							</OpenStreetPopup>
						) : null}
					</OpenStreetMaker>
				);
			});

			return markers;
		}
		return null;
	};

	renderMap = (params) => {
		// we check for `OpenStreetMap` here instead of `window`
		// because leaflet and react-leaflet are incompatible with SSR setup
		// hence the leaflet modules are imported on mount and the component
		// is force-rendered to avail the map module
		if (typeof OpenStreetMap === 'undefined') return null;
		const markers = this.getMarkers(params);

		const style = {
			width: '100%',
			height: '100%',
			position: 'relative',
		};

		return (
			<OpenStreetMap
				style={style}
				zoom={params.zoom}
				center={[params.center.lat, params.center.lng]}
				viewport={{}}
				css={{
					'.leaflet-div-icon': {
						width: 'auto !important',
						border: 0,
					},
					'.leaflet-popup-content-wrapper': {
						borderRadius: '3px !important',
					},
				}}
				touchZoom
				ref={(elem) => {
					if (!this.state.mapRef) {
						this.setState({
							mapRef: elem.leafletElement,
						});
					}
				}}
				onZoomEnd={params.handleZoomChange}
				onDragend={params.handleOnDragEnd}
			>
				<OpenStreetLayer
					url={this.props.tileServer || 'https://{s}.tile.osm.org/{z}/{x}/{y}.png'}
				/>
				{markers}
				{this.props.showMarkers && this.props.markers}
				{params.renderSearchAsMove()}
			</OpenStreetMap>
		);
	};

	render() {
		return (
			<ReactiveMap
				{...this.props}
				renderMap={this.renderMap}
				mapRef={this.state.mapRef}
				mapService={MAP_SERVICES.OPEN_STREET_MAP}
			/>
		);
	}
}

ReactiveOpenStreetMap.propTypes = {
	autoCenter: types.bool,
	autoClosePopover: types.bool,
	center: types.location,
	className: types.string,
	componentId: types.stringRequired,
	dataField: types.stringRequired,
	defaultCenter: types.location,
	defaultZoom: types.number,
	defaultRadius: types.number,
	defaultPin: types.string,
	innerClass: types.style,
	markers: types.children,
	tileServer: types.string,
	title: types.string,
	onError: types.func,
	onPopoverClick: types.func,
	onData: types.func,
	renderError: types.title,
	react: types.react,
	renderItem: types.func,
	render: types.func,
	size: types.number,
	sortBy: types.sortBy,
	showMarkers: types.bool,
	style: types.style,
	unit: types.string,
	config: types.props,
	analytics: types.props,
	headers: types.headers,
	index: types.string,
};

ReactiveOpenStreetMap.defaultProps = {
	size: 10,
	style: {},
	className: null,
	pages: 5,
	pagination: false,
	autoCenter: false,
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

const mapStateToProps = (state) => ({
	config: state.config,
	headers: state.appbaseRef.headers,
	analytics: state.analytics,
});

export default connect(mapStateToProps, null)(ReactiveOpenStreetMap);
