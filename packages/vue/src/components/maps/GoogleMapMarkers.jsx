import VueTypes from 'vue-types';
import GmapCluster from 'gmap-vue/dist/components/cluster';
import InfoWindowWrapper from './InfoWindowWrapper.jsx';
import GoogleMapMarker from './GoogleMapMarker.jsx';

const GoogleMapMarkers = {
	name: 'GoogleMapMarkers',
	props: {
		resultsToRender: VueTypes.array,
		getPosition: VueTypes.func,
		renderItem: VueTypes.func,
		renderClusterPopover: VueTypes.func,
		defaultPin: VueTypes.string,
		autoClosePopover: VueTypes.bool,
		handlePreserveCenter: VueTypes.func,
		renderPopover: VueTypes.func,
		markerProps: VueTypes.object,
		clusterProps: VueTypes.object,
		showMarkerClusters: VueTypes.bool,
	},
	data() {
		return {
			markerOnTop: null,
			openMarkers: {},
			clickedCluster: null,
			clusterMarkers: [],
		};
	},
	methods: {
		setMarkerOnTop(markerOnTop) {
			this.markerOnTop = markerOnTop;
		},
		setOpenMarkers(openMarkers) {
			this.openMarkers = openMarkers;
		},
		getClusterMarkers() {
			if (this.clickedCluster && Array.isArray(this.clickedCluster.getMarkers())) {
				return this.clickedCluster.getMarkers().map(marker => marker.metaData);
			}
			return [];
		},
		getAdditionalProps() {
			return {
				position: {
					lat: this.clickedCluster.getCenter().lat(),
					lng: this.clickedCluster.getCenter().lng(),
				},
				defaultOptions: {
					pixelOffset: new window.google.maps.Size(0, -30),
				},
			};
		},
		closeMarker() {
			this.clickedCluster = null;
			this.clusterMarkers = [];
			this.$emit('close-cluster-popover');
		},
	},
	render() {
		const { resultsToRender } = this.$props;
		const { markerOnTop, openMarkers } = this;
		const markerProps = {
			markerOnTop,
			openMarkers,
			setMarkerOnTop: this.setMarkerOnTop,
			setOpenMarkers: this.setOpenMarkers,
			getPosition: this.getPosition,
			renderItem: this.renderItem,
			defaultPin: this.defaultPin,
			autoClosePopover: this.autoClosePopover,
			handlePreserveCenter: this.handlePreserveCenter,
			renderPopover: this.renderPopover,
			markerProps: this.markerProps,
			showMarkerClusters: this.showMarkerClusters,
		};
		if (this.showMarkerClusters) {
			return (
				<div>
					<GmapCluster
						{...{
							props: this.clusterProps,
						}}
						onclick={cluster => {
							this.clickedCluster = cluster;
							this.clusterMarkers = this.getClusterMarkers();
							this.$emit('open-cluster-popover');
						}}
						ref="clusterRef"
					>
						{resultsToRender.map((marker, index) => (
							<GoogleMapMarker
								index={index}
								marker={marker}
								{...{
									props: markerProps,
									on: this.$listeners,
								}}
							/>
						))}
					</GmapCluster>
					{this.clickedCluster && this.renderClusterPopover ? (
						<InfoWindowWrapper
							id="cluster"
							infoWindowProps={{
								zIndex: 500,
								position: this.getAdditionalProps().position,
								options: this.getAdditionalProps().defaultOptions,
							}}
							renderPopover={handleClose => this.renderClusterPopover({
								markers: this.clusterMarkers,
								cluster: this.clickedCluster,
								handleClose: () => {
									handleClose();
									this.closeMarker();
								},
							})}
							events={{
								closeclick: this.closeMarker,
							}}
						/>
					) : null}
				</div>
			);
		}
		return (
			<div>
				{resultsToRender.map((marker, index) => (
					<GoogleMapMarker
						index={index}
						marker={marker}
						{...{
							props: markerProps,
							on: this.$listeners,
						}}
					/>
				))}
			</div>
		);
	},
};

export default GoogleMapMarkers;
