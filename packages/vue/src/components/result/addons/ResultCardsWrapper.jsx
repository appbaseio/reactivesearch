import { container } from '../../../styles/Card';

const ResultCardsWrapper = {
	name: 'ResultCardsWrapper',
	functional: true,
	render(_, { props, children }) {
		return (
			<div className={container} {...props}>
				{children}
			</div>
		);
	},
};
ResultCardsWrapper.install = function(Vue) {
	Vue.component(ResultCardsWrapper.name, ResultCardsWrapper);
};
export default ResultCardsWrapper;
