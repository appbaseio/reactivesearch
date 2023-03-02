const ResultListDescription = {
	name: 'ResultListDescription',
	functional: true,
	render(context) {
		return <div {...context.$props}>{context.$slots.default()}</div>;
	},
};
ResultListDescription.install = function (Vue) {
	Vue.component(ResultListDescription.name, ResultListDescription);
};
export default ResultListDescription;
