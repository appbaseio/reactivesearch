import VueTypes from 'vue-types';
import { InfoWindow } from 'vue-google-maps-community-fork';

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
			infoWindowRef: null,
		};
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
			<InfoWindow
				closeclick="true"
				ref={`${this.id}-Info-Window`}
				{...this.infoWindowProps}
				on={events}
			>
				<div>{renderPopover(this.handleClose)}</div>
			</InfoWindow>
		);
	},
};

export default InfoWindowWrapper;
