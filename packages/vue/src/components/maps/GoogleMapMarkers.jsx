import VueTypes from 'vue-types';
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
		return (
			<div>
				{resultsToRender.map((marker, index) => (
					<GoogleMapMarker
						index={index}
						marker={marker}
						markerOnTop={markerOnTop}
						openMarkers={openMarkers}
						setMarkerOnTop={this.setMarkerOnTop}
						setOpenMarkers={this.setOpenMarkers}
						getPosition={this.getPosition}
						renderItem={this.renderItem}
						defaultPin={this.defaultPin}
						autoClosePopover={this.autoClosePopover}
						handlePreserveCenter={this.handlePreserveCenter}
						renderPopover={this.renderPopover}
						markerProps={this.markerProps}
					/>
				))}
			</div>
		);
	},
};

export default GoogleMapMarkers;
