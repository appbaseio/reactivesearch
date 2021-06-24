import VueTypes from 'vue-types';
import InfoWindow from 'gmap-vue/dist/components-implementation/info-window';

const InfoWindowWrapper = {
	name: 'InfoWindowWrapper',
	props: {
		id: VueTypes.string,
		renderPopover: VueTypes.func,
		infoWindowProps: VueTypes.object,
		events: VueTypes.object,
	},
	data() {
		return {
			infoWindowRef: null
		}
	},
	mounted() {
		this.infoWindowRef = this.$refs[`${this.id}-Info-Window`];
	},
	methods: {
		handleClose() {
			this.infoWindowRef.$infoWindowObject.close()
		}
	},
	render() {
		const { renderPopover, events } = this
		return (
			<InfoWindow
				ref={`${this.id}-Info-Window`}
				{...{
					props: this.infoWindowProps,
					on: events
				}}
			>
				<div>{renderPopover(this.handleClose)}</div>
			</InfoWindow>
		);
	},
}

export default InfoWindowWrapper;
