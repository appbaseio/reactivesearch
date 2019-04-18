import VueTypes from 'vue-types';
import { helper } from '@appbaseio/reactivecore';
import ReactiveList, { RLConnected } from './ReactiveList.jsx';
import Title from '../../styles/Title';
import ListItem, { container, Image } from '../../styles/ListItem';
import types from '../../utils/vueTypes';

const { getClassName } = helper;

const ResultList = {
	name: 'ResultList',
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
		renderAllData: types.func,
		renderData: types.func,
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
		const { renderData, ...props } = this.$props;
		const onResultStats = this.$props.onResultStats || this.$scopedSlots.onResultStats;
		return (
			<RLConnected
				{...{
					props: {
						...props,
						renderData: this.renderAsList,
						onResultStats,
						listClass: container,
					},
				}}
			/>
		);
	},
	methods: {
		renderAsList({ item, triggerClickAnalytics }) {
			const renderData = this.$props.renderData || this.$scopedSlots.renderData;
			const result = renderData(item);
			if (result) {
				return (
					<ListItem
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
						image={!!result.image}
						small={result.image_size === 'small'}
					>
						{result.image ? (
							<Image
								src={result.image}
								small={result.image_size === 'small'}
								className={getClassName(this.$props.innerClass, 'image')}
							/>
						) : null}
						<article>
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
								<div {...{ domProps: { innerHTML: result.description } }} />
							) : (
								<div>{result.description}</div>
							)}
						</article>
					</ListItem>
				);
			}

			return null;
		},
	},
};
ResultList.generateQueryOptions = props => ReactiveList.generateQueryOptions(props);
ResultList.install = function(Vue) {
	Vue.component(ResultList.name, ResultList);
};

export default ResultList;
