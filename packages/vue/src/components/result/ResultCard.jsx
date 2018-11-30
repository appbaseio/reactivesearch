import VueTypes from 'vue-types';
import { helper } from '@appbaseio/reactivecore';
import { RLConnected } from './ReactiveList.jsx';
import Title from '../../styles/Title';
import types from '../../utils/vueTypes';
import Card, { container, Image } from '../../styles/Card';

const { getClassName } = helper;

const ResultCard = {
	name: 'ResultCard',
	props: {
		currentPage: VueTypes.number.def(0),
		includeFields: types.includeFields.def(['*']),
		// component props
		className: types.string,
		componentId: types.stringRequired,
		dataField: types.stringRequired,
		defaultQuery: types.func,
		excludeFields: types.excludeFields.def([]),
		innerClass: types.style,
		listClass: VueTypes.string.def(''),
		loader: types.title,
		onAllData: types.func,
		onData: types.func,
		onResultStats: types.func,
		onNoResults: VueTypes.string.def('No Results found.'),
		pages: VueTypes.number.def(5),
		pagination: VueTypes.bool.def(false),
		paginationAt: types.paginationAt.def('bottom'),
		react: types.react,
		showResultStats: VueTypes.bool.def(true),
		size: VueTypes.number.def(10),
		sortBy: types.sortBy,
		sortOptions: types.sortOptions,
		stream: types.bool,
		URLParams: VueTypes.bool.def(false),
		target: VueTypes.string.def('_blank'),
	},
	render() {
		const { onData, ...props } = this.$props;
		const onResultStats = this.$props.onResultStats || this.$scopedSlots.onResultStats;
		return (
			<RLConnected
				{...{
					props: {
						...props,
						onData: this.renderAsCard,
						onResultStats,
						listClass: container,
					},
				}}
			/>
		);
	},
	methods: {
		renderAsCard({ item, triggerClickAnalytics }) {
			const onData = this.$props.onData || this.$scopedSlots.onData;
			const result = onData(item);
			if (result) {
				return (
					<Card
						key={item._id}
						href={result.url}
						className={getClassName(this.$props.innerClass, 'listItem')}
						target={this.$props.target}
						rel={this.$props.target === '_blank' ? 'noopener noreferrer' : null}
						{...{
							on: {
								click: triggerClickAnalytics,
							},
						}}
						{...result.containerProps}
					>
						<Image
							style={{ backgroundImage: `url(${result.image})` }}
							className={getClassName(this.$props.innerClass, 'image')}
						/>
						{typeof result.title === 'string' ? (
							<Title
								{...{ domProps: { innerHTML: result.title } }}
								className={getClassName(this.$props.innerClass, 'title')}
							/>
						) : (
							<Title className={getClassName(this.$props.innerClass, 'title')}>
								{result.title}
							</Title>
						)}
						{typeof result.description === 'string' ? (
							<article {...{ domProps: { innerHTML: result.description } }} />
						) : (
							<article>{result.description}</article>
						)}
					</Card>
				);
			}

			return null;
		},
	},
};

ResultCard.install = function(Vue) {
	Vue.component(ResultCard.name, ResultCard);
};

export default ResultCard;
