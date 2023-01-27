import VueTypes from 'vue-types';
import types from '../../utils/vueTypes';
import ResultCardTitle from './addons/ResultCardTitle.jsx';
import ResultCardImage from './addons/ResultCardImage.jsx';
import ResultCardDescription from './addons/ResultCardDescription.jsx';
import Card from '../../styles/Card';

const ResultCard = {
	name: 'ResultCard',
	components: {
		ResultCardTitle,
		ResultCardImage,
		ResultCardDescription,
	},
	props: {
		target: VueTypes.string.def('_blank'),
		href: types.string,
	},
	render() {
		const children = this.$slots.default;
		const { href, target, ...rest } = this.$props;
		return (
			<Card
				href={href}
				target={target}
				rel={target === '_blank' ? 'noopener noreferrer' : null}
				{...rest}
			>
				{children()}
			</Card>
		);
	},
};

ResultCard.install = function (Vue) {
	Vue.component(ResultCard.name, ResultCard);
	Vue.component(ResultCardTitle.name, ResultCardTitle);
	Vue.component(ResultCardImage.name, ResultCardImage);
	Vue.component(ResultCardDescription.name, ResultCardDescription);
};

export default ResultCard;
