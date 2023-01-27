import VueTypes from 'vue-types';
import ListItem from '../../styles/ListItem';
import types from '../../utils/vueTypes';
import ResultListContent from './addons/ResultListContent.jsx';
import ResultListDescription from './addons/ResultListDescription.jsx';
import ResultListImage from './addons/ResultListImage.jsx';
import ResultListTitle from './addons/ResultListTitle.jsx';

const ResultList = {
	name: 'ResultList',
	props: {
		href: types.string,
		target: VueTypes.string.def('_blank'),
	},
	components: {
		ResultListContent,
		ResultListDescription,
		ResultListImage,
		ResultListTitle,
	},
	data() {
		this.__state = {
			hasImage: false,
			isSmall: false,
		};
		return this.__state;
	},
	mounted() {
		const children = this.$slots.default();
		const ImageChild = children.find((o) => o.type && o.type.name === ResultListImage.name);
		if (ImageChild && ImageChild.props) {
			this.hasImage = true;
			if (ImageChild.props.small) {
				this.isSmall = true;
			}
		}
	},
	render() {
		const { href, target, ...props } = this.$props;
		const { hasImage, isSmall } = this;
		const children = this.$slots.default;
		return (
			<ListItem
				href={href}
				image={hasImage}
				small={isSmall}
				target={target}
				rel={target === '_blank' ? 'noopener noreferrer' : null}
				{...props}
			>
				{children()}
			</ListItem>
		);
	},
};

ResultList.install = function (Vue) {
	Vue.component(ResultList.name, ResultList);
	Vue.component(ResultListContent.name, ResultListContent);
	Vue.component(ResultListDescription.name, ResultListDescription);
	Vue.component(ResultListImage.name, ResultListImage);
	Vue.component(ResultListTitle.name, ResultListTitle);
};

export default ResultList;
