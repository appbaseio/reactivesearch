import VueTypes from 'vue-types';
import GmapCluster from 'gmap-vue/dist/components/cluster';
import GoogleMapMarker from './GoogleMapMarker.jsx';

const GoogleMapMarkers = {
	name: 'GoogleMapMarkers',
	props: {
		resultsToRender: VueTypes.array,
		getPosition: VueTypes.func,
		renderItem: VueTypes.func,
		defaultPin: VueTypes.string,
		autoClosePopover: VueTypes.bool,
		handlePreserveCenter: VueTypes.func,
		renderPopover: VueTypes.func,
		markerProps: VueTypes.object,
		showMarkerClusters: VueTypes.bool,
	},
	data() {
		return {
			markerOnTop: null,
			openMarkers: {},
		};
	},
	methods: {
		setMarkerOnTop(markerOnTop) {
			this.markerOnTop = markerOnTop;
		},
		setOpenMarkers(openMarkers) {
			this.openMarkers = openMarkers;
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
				<GmapCluster>
					{resultsToRender.map((marker, index) => (
						<GoogleMapMarker
							index={index}
							marker={marker}
							{...{
								props: markerProps,
							}}
						/>
					))}
				</GmapCluster>
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
						}}
					/>
				))}
			</div>
		);
	},
};

export default GoogleMapMarkers;
