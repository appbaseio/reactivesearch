const ResultListContent = {
	name: 'ResultListContent',
	functional: true,
	render(context) {
		return <article {...context.$props}>{context.$slots.default()}</article>;
	},
};
ResultListContent.install = function (Vue) {
	Vue.component(ResultListContent.name, ResultListContent);
};
export default ResultListContent;
