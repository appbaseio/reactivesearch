import { container } from '../../../styles/ListItem';

const ResultListWrapper = {
	name: 'ResultListWrapper',

	functional: true,
	render(context) {
		return (
			<div className={container} {...context.$props}>
				{context.$slots.default()}
			</div>
		);
	},
};
ResultListWrapper.install = function (Vue) {
	Vue.component(ResultListWrapper.name, ResultListWrapper);
};
export default ResultListWrapper;
