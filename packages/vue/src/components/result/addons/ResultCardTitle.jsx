import Title from '../../../styles/Title';

const ResultCardTitle = {
	name: 'ResultCardTitle',
	render() {
		const children = this.$slots.default;
		return <Title {...this.$props}>{children()}</Title>;
	},
};
ResultCardTitle.install = function (Vue) {
	Vue.component(ResultCardTitle.name, ResultCardTitle);
};
export default ResultCardTitle;
