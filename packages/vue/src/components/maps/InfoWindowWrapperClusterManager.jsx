import VueTypes from 'vue-types';
import InfoWindowClusterManager from './InfoWindowClusterManager.jsx';

const InfoWindowWrapper = {
	name: 'InfoWindowWrapperClusterManager',
	props: {
		id: VueTypes.string,
		renderPopover: VueTypes.func,
		infoWindowProps: VueTypes.object,
		events: VueTypes.object,
		marker: VueTypes.Object,
	},
	data() {
		return {
			infoWindowRef: null,
		};
	},
	provide() {
		return { $markerPromise: Promise.resolve(this.marker) };
	},
	mounted() {
		this.infoWindowRef = this.$refs[`${this.id}-Info-Window`];
	},
	methods: {
		handleClose() {
			this.infoWindowRef.$infoWindowObject.close();
		},
	},
	render() {
		const { renderPopover, events } = this;
		return (
			<InfoWindowClusterManager
				ref={`${this.id}-Info-Window`}
				{...{
					props: this.infoWindowProps,
					on: events,
				}}
			>
				<div>{renderPopover(this.handleClose)}</div>
			</InfoWindowClusterManager>
		);
	},
};

export default InfoWindowWrapper;
