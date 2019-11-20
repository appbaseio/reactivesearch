import VueTypes from 'vue-types';
import { Image } from '../../../styles/Card';

const ResultCardImage = {
	name: 'ResultCardImage',
	props: {
		src: VueTypes.string.isRequired,
	},
	render() {
		const { src, ...props } = this.$props;
		return <Image style={{ backgroundImage: `url(${src})` }} {...props} />;
	},
};
ResultCardImage.install = function(Vue) {
	Vue.component(ResultCardImage.name, ResultCardImage);
};
export default ResultCardImage;
