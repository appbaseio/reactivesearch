import { container } from '../../../styles/Card';

const ResultCardsWrapper = {
	name: 'ResultCardsWrapper',
	functional: true,
	render(context) {
		return (
			<div className={container} {...context.$props}>
				{context.$slots.default()}
			</div>
		);
	},
};
ResultCardsWrapper.install = function (Vue) {
	Vue.component(ResultCardsWrapper.name, ResultCardsWrapper);
};
export default ResultCardsWrapper;
