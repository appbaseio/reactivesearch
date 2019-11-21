const ResultCardDescription = {
	name: 'ResultCardDescription',
	functional: true,
	render(_, { props, children }) {
		return <article {...props}>{children}</article>;
	},
};
ResultCardDescription.install = function(Vue) {
	Vue.component(ResultCardDescription.name, ResultCardDescription);
};
export default ResultCardDescription;
