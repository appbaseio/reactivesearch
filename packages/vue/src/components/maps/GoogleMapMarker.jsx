import Marker from 'gmap-vue/dist/components/marker';
import { Actions } from '@appbaseio/reactivecore';
import VueTypes from 'vue-types';
import { connect } from '../../utils/index';
import MarkerWithLabel from './MarkerWithLabel.jsx';
import InfoWindowWrapper from './InfoWindowWrapper.jsx';
import { MapPin, MapPinArrow, mapPinWrapper } from './addons/styles';

const { recordResultClick } = Actions;

const GoogleMapMarker = {
	name: 'GoogleMapMarker',
	props: {
		index: VueTypes.number,
		marker: VueTypes.object.isRequired,
		getPosition: VueTypes.func.isRequired,
		defaultPin: VueTypes.string,
		renderItem: VueTypes.func,
		setOpenMarkers: VueTypes.func.isRequired,
		handlePreserveCenter: VueTypes.func.isRequired,
		autoClosePopover: VueTypes.bool,
		openMarkers: VueTypes.object,
		renderPopover: VueTypes.func,
		highlightMarkerOnHover: VueTypes.bool,
	},
	data() {
		return {
			zIndex: 0,
		}
	},
	methods: {
		increaseMarkerZIndex() {
			const { handlePreserveCenter } = this.$props;
			if(this.highlightMarkerOnHover) {
				this.zIndex += 1;
			}
			handlePreserveCenter(true);
		},
		removeMarkerZIndex() {
			const { handlePreserveCenter } = this.$props;
			if(this.highlightMarkerOnHover) {
				this.zIndex -= 1;
			}
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
			this.$emit('open-marker-popover', marker);
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
			this.$emit('close-marker-popover', marker);
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
					<InfoWindowWrapper
						key={`${item._id}-InfoWindow`}
						id={item._id}
						renderPopover={handleClose =>
							renderPopover({
								item,
								handleClose: () => {
									handleClose();
									this.closeMarker();
								},
							})
						}
						infoWindowProps={{
							zIndex: 500,
							position: additionalProps.position,
							options: additionalProps.defaultOptions,
						}}
						events={{
							closeclick: () => this.closeMarker(),
						}}
					/>
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
			renderPopover,
			markerProps: customMarkerProps,
			marker,
		} = this.$props;
		const markerProps = {};
		if (this.zIndex) {
			markerProps.zIndex = window.google.maps.Marker.MAX_ZINDEX + this.zIndex;
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
						handleMouseOut={this.removeMarkerZIndex}
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
			}
			if ('icon' in data) {
				markerProps.icon = data.icon;
			} else {
				return (
					<MarkerWithLabel
						key={marker._id}
						metaData={marker}
						marker={getPosition(marker)}
						handleClick={this.openMarker}
						handleMouseOver={this.increaseMarkerZIndex}
						handleMouseOut={this.removeMarkerZIndex}
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
				url: defaultPin,
			};
		}
		return (
			<Marker
				key={marker._id}
				icon={markerProps.icon}
				zIndex={markerProps.zIndex}
				onclick={() =>
					this.openMarker()
				}
				onmouseover={this.increaseMarkerZIndex}
				onmouseout={this.removeMarkerZIndex}
				{...{ props: customMarkerProps }}
				position={getPosition(marker)}
				options={{
					metaData: marker,
				}}
			>
				{renderPopover ? this.renderPopoverClick(marker) : null}
			</Marker>
		);
	},
};

const mapDispatchToProps = {
	recordResultClick,
};

export default connect(() => null, mapDispatchToProps)(GoogleMapMarker);
