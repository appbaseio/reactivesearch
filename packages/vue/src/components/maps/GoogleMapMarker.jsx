import Marker from 'gmap-vue/dist/components/marker';
import InfoWindow from 'gmap-vue/dist/components-implementation/info-window';
import { Actions } from '@appbaseio/reactivecore';
import VueTypes from 'vue-types';
import { connect } from '../../utils/index';
import MarkerWithLabel from './MarkerWithLabel.jsx';
import { MapPin, MapPinArrow, mapPinWrapper } from './addons/styles';

const {
	recordResultClick,
} = Actions;

const GoogleMapMarker = {
	name: 'GoogleMapMarker',
	props: {
		index: VueTypes.number,
		marker: VueTypes.object.isRequired,
		getPosition: VueTypes.func.isRequired,
		markerOnTop: VueTypes.string,
		defaultPin: VueTypes.string,
		renderItem: VueTypes.func,
		setMarkerOnTop: VueTypes.func.isRequired,
		setOpenMarkers: VueTypes.func.isRequired,
		handlePreserveCenter: VueTypes.func.isRequired,
		autoClosePopover: VueTypes.bool,
		openMarkers: VueTypes.object,
		renderPopover: VueTypes.func,
	},
	methods: {
		increaseMarkerZIndex() {
			const { setMarkerOnTop: handleTopMarker, handlePreserveCenter, marker } = this.$props;
			handleTopMarker(marker._id);
			handlePreserveCenter(true);
		},
		removeMarkerZIndex() {
			const { setMarkerOnTop: handleTopMarker, handlePreserveCenter } = this.$props;
			handleTopMarker(null);
			handlePreserveCenter(true);
		},
		openMarker() {
			const {
				setOpenMarkers: handleOpenMarkers,
				openMarkers,
				marker,
				autoClosePopover,
				handlePreserveCenter,
			} = this.$props;
			const id = marker._id;
			const newOpenMarkers = autoClosePopover
				? { [id]: true }
				: { ...openMarkers, [id]: true };

			handleOpenMarkers(newOpenMarkers);
			handlePreserveCenter(true);
			this.triggerAnalytics();
			this.$emit('open-marker-popover');
		},
		closeMarker() {
			const {
				setOpenMarkers: handleOpenMarkers,
				marker,
				autoClosePopover,
				handlePreserveCenter,
				openMarkers,
			} = this.$props;
			const id = marker._id;

			const { [id]: del, ...activeMarkers } = openMarkers;
			const newOpenMarkers = autoClosePopover ? {} : activeMarkers;

			handleOpenMarkers(newOpenMarkers);
			handlePreserveCenter(true);
			this.$emit('close-marker-popover');
		},
		triggerAnalytics() {
			this.recordResultClick(this.index, this.marker._id);
		},
		renderPopoverClick(item, includeExternalSettings = false) {
			let additionalProps = {};
			const { getPosition, renderPopover, openMarkers } = this.$props;
			if (includeExternalSettings) {
				// to render pop-over correctly with MarkerWithLabel
				additionalProps = {
					position: getPosition(item),
					defaultOptions: {
						pixelOffset: new window.google.maps.Size(0, -30),
					},
				};
			}

			if (item._id in openMarkers) {
				return (
					<InfoWindow
						zIndex={500}
						key={`${item._id}-InfoWindow`}
						oncloseclick={() => this.closeMarker()}
						position={additionalProps.position}
						options={additionalProps.defaultOptions}
					>
						<div>{renderPopover(item)}</div>
					</InfoWindow>
				);
			}
			return null;
		},
	},
	render() {
		const {
			getPosition,
			renderItem,
			defaultPin,
			autoClosePopover,
			handlePreserveCenter,
			renderPopover,
			markerProps: customMarkerProps,
			marker,
			markerOnTop,
		} = this.$props;

		const markerProps = {};
		if (markerOnTop === marker._id) {
			markerProps.zIndex = window.google.maps.Marker.MAX_ZINDEX + 1;
		}

		if (renderItem) {
			const data = renderItem(marker);
			if ('label' in data) {
				return (
					<MarkerWithLabel
						key={marker._id}
						metaData={marker}
						marker={getPosition(marker)}
						labelAnchor={new window.google.maps.Point(0, 30)}
						handleMouseOver={this.increaseMarkerZIndex}
						handleFocus={this.increaseMarkerZIndex}
						handleMouseOut={this.removeMarkerZIndex}
						handleBlur={this.removeMarkerZIndex}
						handleClick={this.openMarker}
						zIndex={markerProps.zIndex}
						{...{ props: customMarkerProps }}
						renderMarker={() => (
							<div css={mapPinWrapper}>
								<MapPin>{data.label}</MapPin>
								<MapPinArrow />
								{renderPopover ? this.renderPopoverClick(marker, true) : null}
							</div>
						)}
					/>
				);
			} if ('icon' in data) {
				markerProps.icon = data.icon;
			} else {
				return (
					<MarkerWithLabel
						key={marker._id}
						metaData={marker}
						marker={getPosition(marker)}
						handleClick={this.openMarker}
						handleMouseOver={this.increaseMarkerZIndex}
						handleFocus={this.increaseMarkerZIndex}
						handleMouseOut={this.removeMarkerZIndex}
						handleBlur={this.removeMarkerZIndex}
						zIndex={markerProps.zIndex}
						{...{ props: customMarkerProps }}
						renderMarker={() => (
							<div css={mapPinWrapper}>
								{typeof data.custom === 'function'
									? data.custom(marker)
									: data.custom}
								{renderPopover ? this.renderPopoverClick(marker, true) : null}
							</div>
						)}
					/>
				);
			}
		} else if (defaultPin) {
			markerProps.icon = {
				url: defaultPin
			};
		}
		return (
			<Marker
				key={marker._id}
				icon={markerProps.icon}
				zIndex={markerProps.zIndex}
				onclick={() =>
					this.openMarker(marker._id, autoClosePopover || false, handlePreserveCenter)
				}
				onmouseover={this.increaseMarkerZIndex}
				onfocus={this.increaseMarkerZIndex}
				onmouseout={this.removeMarkerZIndex}
				onblur={this.removeMarkerZIndex}
				{...{ props: customMarkerProps }}
				position={getPosition(marker)}
				options={{
					metaData: marker
				}}
			>
				{renderPopover ? this.renderPopoverClick(marker) : null}
			</Marker>
		);
	},
};

const mapDispatchToProps = {
	recordResultClick,
}

export default connect(() => null, mapDispatchToProps)(GoogleMapMarker);
