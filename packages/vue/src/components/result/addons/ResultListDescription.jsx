const ResultListDescription = {
	name: 'ResultListDescription',
	functional: true,
	render(_, { props, children }) {
		return <div {...props}>{children}</div>;
	},
};
ResultListDescription.install = function(Vue) {
	Vue.component(ResultListDescription.name, ResultListDescription);
};
export default ResultListDescription;
