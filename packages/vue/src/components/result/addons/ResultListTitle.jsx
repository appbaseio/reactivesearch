import Title from '../../../styles/Title';

const ResultListTitle = {
	name: 'ResultListTitle',
	render() {
		const children = this.$slots.default;
		return <Title {...this.$props}>{children()}</Title>;
	},
};

ResultListTitle.install = function (Vue) {
	Vue.component(ResultListTitle.name, ResultListTitle);
};
export default ResultListTitle;
