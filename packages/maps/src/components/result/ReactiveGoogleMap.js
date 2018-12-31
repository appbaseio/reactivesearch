import React, { Component } from 'react';
import { withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps';
import MarkerClusterer from 'react-google-maps/lib/components/addons/MarkerClusterer';
import { MarkerWithLabel } from 'react-google-maps/lib/components/addons/MarkerWithLabel';
import { getInnerKey, isEqual } from '@appbaseio/reactivecore/lib/utils/helper';

import Dropdown from '@appbaseio/reactivesearch/lib/components/shared/Dropdown';
import { MapPin, MapPinArrow, mapPinWrapper } from './addons/styles/MapPin';

import ReactiveMap from './ReactiveMap';

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
			markerOnTop: null,
			openMarkers: {},
			mapRef: null,
			updaterKey: 0,
		};
	}

	componentWillUpdate(nextProps, nextState) {
		if (
			!isEqual(this.state.openMarkers, nextState.openMarkers)
			|| !isEqual(this.state.currentMapStyle, nextState.currentMapStyle)
		) {
			this.handleUpdaterKey();
		}
	}

	openMarkerInfo = (id, autoClosePopover, handlePreserveCenter) => {
		const openMarkers = autoClosePopover
			? { [id]: true }
			: { ...this.state.openMarkers, [id]: true };
		this.setState({
			openMarkers,
		});

		handlePreserveCenter(true);
	};

	closeMarkerInfo = (id, autoClosePopover, handlePreserveCenter) => {
		const { [id]: del, ...activeMarkers } = this.state.openMarkers;
		const openMarkers = autoClosePopover ? {} : activeMarkers;

		this.setState({
			openMarkers,
		});

		handlePreserveCenter(true);
	};

	handleUpdaterKey = () => {
		this.setState(prevState => ({
			updaterKey: prevState.updaterKey + 1,
		}));
	};

	renderPopover = (item, params, includeExternalSettings = false) => {
		let additionalProps = {};

		if (includeExternalSettings) {
			// to render pop-over correctly with MarkerWithLabel
			additionalProps = {
				position: params.getPosition(item),
				defaultOptions: {
					pixelOffset: new window.google.maps.Size(0, -30),
				},
			};
		}

		if (item._id in this.state.openMarkers) {
			return (
				<InfoWindow
					zIndex={500}
					key={`${item._id}-InfoWindow`}
					onCloseClick={() =>
						this.closeMarkerInfo(
							item._id,
							params.autoClosePopover,
							params.handlePreserveCenter,
						)
					}
					{...additionalProps}
				>
					<div>{params.onPopoverClick(item)}</div>
				</InfoWindow>
			);
		}
		return null;
	};

	increaseMarkerZIndex = (id, handlePreserveCenter) => {
		this.setState({
			markerOnTop: id,
		});

		handlePreserveCenter(true);
	};

	removeMarkerZIndex = (handlePreserveCenter) => {
		this.setState({
			markerOnTop: null,
		});

		handlePreserveCenter(true);
	};

	getMarkers = (params) => {
		let markers = [];
		if (params.showMarkers) {
			markers = params.resultsToRender.map((item) => {
				const markerProps = {
					position: params.getPosition(item),
				};

				if (this.state.markerOnTop === item._id) {
					markerProps.zIndex = window.google.maps.Marker.MAX_ZINDEX + 1;
				}

				if (params.onData) {
					const data = params.onData(item);

					if ('label' in data) {
						return (
							<MarkerWithLabel
								key={item._id}
								labelAnchor={new window.google.maps.Point(0, 30)}
								icon="https://i.imgur.com/h81muef.png" // blank png to remove the icon
								onClick={() =>
									this.openMarkerInfo(
										item._id,
										params.autoClosePopover,
										params.handlePreserveCenter,
									)
								}
								onMouseOver={() =>
									this.increaseMarkerZIndex(item._id, params.handlePreserveCenter)
								}
								onFocus={() =>
									this.increaseMarkerZIndex(item._id, params.handlePreserveCenter)
								}
								onMouseOut={() =>
									this.removeMarkerZIndex(params.handlePreserveCenter)
								}
								onBlur={() => this.removeMarkerZIndex(params.handlePreserveCenter)}
								{...markerProps}
								{...this.props.markerProps}
							>
								<div className={mapPinWrapper}>
									<MapPin>{data.label}</MapPin>
									<MapPinArrow />
									{params.onPopoverClick
										? this.renderPopover(item, params, true)
										: null}
								</div>
							</MarkerWithLabel>
						);
					} else if ('icon' in data) {
						markerProps.icon = data.icon;
					} else {
						return (
							<MarkerWithLabel
								key={item._id}
								labelAnchor={new window.google.maps.Point(0, 0)}
								onMouseOver={() =>
									this.increaseMarkerZIndex(item._id, params.handlePreserveCenter)
								}
								onFocus={() =>
									this.increaseMarkerZIndex(item._id, params.handlePreserveCenter)
								}
								onMouseOut={() =>
									this.removeMarkerZIndex(params.handlePreserveCenter)
								}
								onBlur={() => this.removeMarkerZIndex(params.handlePreserveCenter)}
								{...markerProps}
								{...params.markerProps}
							>
								{data.custom}
							</MarkerWithLabel>
						);
					}
				} else if (params.defaultPin) {
					markerProps.icon = params.defaultPin;
				}

				return (
					<Marker
						key={item._id}
						onClick={() =>
							this.openMarkerInfo(
								item._id,
								params.autoClosePopover || false,
								params.handlePreserveCenter,
							)
						}
						onMouseOver={() =>
							this.increaseMarkerZIndex(item._id, params.handlePreserveCenter)
						}
						onFocus={() =>
							this.increaseMarkerZIndex(item._id, params.handlePreserveCenter)
						}
						onMouseOut={() => this.removeMarkerZIndex(params.handlePreserveCenter)}
						onBlur={() => this.removeMarkerZIndex(params.handlePreserveCenter)}
						{...markerProps}
						{...params.markerProps}
					>
						{params.onPopoverClick ? this.renderPopover(item, params) : null}
					</Marker>
				);
			});
		}
		return markers;
	};

	setMapStyle = (currentMapStyle) => {
		this.setState({
			currentMapStyle,
		});
	};

	renderMap = (params) => {
		const markers = this.getMarkers(params);

		const style = {
			width: '100%',
			height: '100%',
			position: 'relative',
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
							{markers}
						</MarkerClusterer>
					) : (
						markers
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

export default ReactiveGoogleMap;
