import VueTypes from 'vue-types';
import { helper, Actions } from '@appbaseio/reactivecore';
import InfoWindowWrapperClusterManager from './InfoWindowWrapperClusterManager.jsx';
import { connect } from '../../utils/index';

const { isEqual } = helper;
const { recordResultClick } = Actions;

const ClusterMarkers = {
	name: 'ClusterMarkers',
	props: {
		markers: VueTypes.array,
		getPosition: VueTypes.func,
		defaultPin: VueTypes.string,
		renderItem: VueTypes.func,
		markerProps: VueTypes.object,
		handlePreserveCenter: VueTypes.func.isRequired,
		autoClosePopover: VueTypes.bool,
		renderPopover: VueTypes.func,
		highlightMarkerOnHover: VueTypes.bool,
	},
	inject: {
		$clusterPromise: {
			default: null,
		},
		$mapPromise: {},
	},
	data() {
		return {
			openMarkers: {},
		};
	},
	mounted() {
		this.buildMarkers(this.markers);
	},
	destroy() {
		// Remove active markers
		this.buildMarkers([]);
	},
	watch: {
		markers(newVal, oldVal) {
			if (!isEqual(oldVal, newVal)) {
				this.buildMarkers(newVal);
			}
		},
	},
	methods: {
		triggerAnalytics(clickPosition, markerId) {
			this.recordResultClick(clickPosition, markerId);
		},
		setOpenMarkers(openMarkers) {
			this.openMarkers = openMarkers;
		},
		closeMarker(marker) {
			const { autoClosePopover, handlePreserveCenter } = this.$props;
			const id = marker.metaData && marker.metaData._id;
			const { [id]: del, ...activeMarkers } = this.openMarkers;
			const newOpenMarkers = autoClosePopover ? {} : activeMarkers;
			this.setOpenMarkers(newOpenMarkers);
			handlePreserveCenter(true);
			this.$emit('close-marker-popover', marker);
		},
		openMarker(marker, index) {
			const { autoClosePopover, handlePreserveCenter } = this;
			const id = marker.metaData && marker.metaData._id;
			const newOpenMarkers = autoClosePopover
				? { [id]: marker }
				: { ...this.openMarkers, [id]: marker };

			this.setOpenMarkers(newOpenMarkers);
			handlePreserveCenter(true);
			this.triggerAnalytics(id, index);
			this.$emit('open-marker-popover', marker.metaData);
		},
		buildMarkers(markersToRender) {
			this.$mapPromise
				.then((map) => {
					if (this.$clusterPromise) {
						this.$clusterPromise.then((clusterObject) => {
							// Detect changed markers
							const markersToAdd = [];
							const markersToRemove = [];
							// A map of marker id to active status, `true` means marker is active
							// `false` means marker is stale and should be removed
							const oldMarkersIdMap = {};
							(this.$markers || []).forEach((marker) => {
								if (marker.metaData && marker.metaData._id) {
									// mark all old markers as stale
									oldMarkersIdMap[marker.metaData._id] = false;
								}
							});
							// build map markers
							markersToRender.forEach((marker, index) => {
								// Avoid if a marker is already rendered
								if (marker._id && oldMarkersIdMap[marker._id] !== undefined) {
									// Set old marker as active
									oldMarkersIdMap[marker._id] = true;
								} else {
									// Initialize the maps with the given options
									const initialOptions = {
										...this.markerProps,
										metaData: marker,
										map,
										position: this.getPosition(marker),
									};

									if (this.renderItem) {
										const data = this.renderItem(marker);
										if ('label' in data) {
											initialOptions.label = data.label;
										}
										if ('icon' in data) {
											initialOptions.icon = data.icon;
										}
									} else if (this.defaultPin) {
										initialOptions.icon = {
											url: this.defaultPin,
										};
									}

									const { options: extraOptions, ...finalOptions }
										= initialOptions;

									if (this.$clusterPromise) {
										finalOptions.map = null;
									}
									// eslint-disable-next-line
									const markerObject = new google.maps.Marker(finalOptions);

									markerObject.addListener('click', () => {
										this.openMarker(markerObject, index);
									});
									markersToAdd.push(markerObject);
								}
							});
							// Current active markers
							const currentMarkers = [];
							markersToAdd.forEach((marker) => {
								currentMarkers.push(marker);
							});
							(this.$markers || []).forEach((marker) => {
								if (marker.metaData && marker.metaData._id) {
									// if maker is not active then add to remove list
									if (!oldMarkersIdMap[marker.metaData._id]) {
										markersToRemove.push(marker);
									} else {
										currentMarkers.push(marker);
									}
								}
							});
							// Remove old markers
							clusterObject.removeMarkers(markersToRemove);
							// Add inital markers at once
							clusterObject.addMarkers(markersToAdd);
							this.$clusterObject = clusterObject;
							this.$map = map;
							this.$markers = currentMarkers;
						});
					}
				})
				.catch((error) => {
					throw error;
				});
		},
	},
	render() {
		if (!this.renderPopover) {
			return null;
		}
		return (
			<div>
				{Object.keys(this.openMarkers).map((markerId) => {
					const marker = this.openMarkers[markerId];
					const item = marker.metaData;
					return (
						<InfoWindowWrapperClusterManager
							key={`${markerId}-InfoWindow`}
							id={markerId}
							renderPopover={(handleClose) =>
								this.renderPopover({
									item,
									handleClose: () => {
										handleClose();
										this.closeMarker(item);
									},
								})
							}
							marker={marker}
							infoWindowProps={{
								zIndex: 500,
							}}
							events={{
								closeclick: () => this.closeMarker(marker),
							}}
						/>
					);
				})}
			</div>
		);
	},
};

const mapDispatchToProps = {
	recordResultClick,
};

export default connect(() => null, mapDispatchToProps)(ClusterMarkers);
