import { container } from '../../../styles/ListItem';

const ResultListWrapper = {
	name: 'ResultListWrapper',
	functional: true,
	render(_, { props, children }) {
		return (
			<div className={container} {...props}>
				{children}
			</div>
		);
	},
};
ResultListWrapper.install = function(Vue) {
	Vue.component(ResultListWrapper.name, ResultListWrapper);
};
export default ResultListWrapper;
