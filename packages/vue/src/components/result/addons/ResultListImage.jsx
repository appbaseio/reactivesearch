import VueTypes from 'vue-types';
import { Image } from '../../../styles/ListItem';

const ResultListImage = {
	name: 'ResultListImage',
	props: {
		src: VueTypes.string.isRequired,
		small: VueTypes.bool.def(false),
	},
	render() {
		const { src, small, ...props } = this.$props;
		return <Image src={src} small={small} {...props} />;
	},
};
ResultListImage.install = function(Vue) {
	Vue.component(ResultListImage.name, ResultListImage);
};
export default ResultListImage;
