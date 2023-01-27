const ResultCardDescription = {
	name: 'ResultCardDescription',
	functional: true,
	render(context) {
		return <article {...context.$props}>{context.$slots.default()}</article>;
	},
};
ResultCardDescription.install = function (Vue) {
	Vue.component(ResultCardDescription.name, ResultCardDescription);
};
export default ResultCardDescription;
