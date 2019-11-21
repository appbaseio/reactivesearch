const ResultListContent = {
	name: 'ResultListContent',
	functional: true,
	render(_, { props, children }) {
		return <article {...props}>{children}</article>;
	},
};
ResultListContent.install = function(Vue) {
	Vue.component(ResultListContent.name, ResultListContent);
};
export default ResultListContent;
