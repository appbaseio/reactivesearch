import React, { Component } from 'react';
import { View } from 'react-native';
import { Text, Spinner, Button, Icon } from 'native-base';

import {
	addComponent,
	removeComponent,
	setStreaming,
	watchComponent,
	setQueryOptions,
	updateQuery,
	loadMore,
	setQueryListener,
} from '@appbaseio/reactivecore/lib/actions';
import {
	isEqual,
	getQueryOptions,
	pushToAndClause,
	parseHits,
	getInnerKey,
} from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';

import List from './addons/List';
import withTheme from '../../theme/withTheme';
import { connect } from '../../utils';

class ReactiveList extends Component {
	constructor(props) {
		super(props);

		let currentPage = 0;
		if (this.props.defaultPage >= 0) {
			currentPage = this.props.defaultPage;
		} else if (this.props.currentPage) {
			currentPage = Math.max(this.props.currentPage - 1, 0);
		}
		this.initialFrom = currentPage * props.size; // used for page resetting on query change
		this.state = {
			from: this.initialFrom,
			isLoading: true,
			currentPage,
			totalPages: 0,
		};
		this.listRef = null;
		this.internalComponent = `${props.componentId}__internal`;
		props.setQueryListener(props.componentId, props.onQueryChange, props.onError);
	}

	componentDidMount() {
		this.props.addComponent(this.internalComponent);
		this.props.addComponent(this.props.componentId);

		if (this.props.stream) {
			this.props.setStreaming(this.props.componentId, true);
		}

		const options = getQueryOptions(this.props);
		options.from = this.state.from;
		if (this.props.sortOptions) {
			options.sort = [
				{
					[this.props.sortOptions[0].dataField]: {
						order: this.props.sortOptions[0].sortBy,
					},
				},
			];
		} else if (this.props.sortBy) {
			options.sort = [
				{
					[this.props.dataField]: {
						order: this.props.sortBy,
					},
				},
			];
		}

		// Override sort query with defaultQuery's sort if defined
		this.defaultQuery = null;
		if (this.props.defaultQuery) {
			this.defaultQuery = this.props.defaultQuery();
			if (this.defaultQuery.sort) {
				options.sort = this.defaultQuery.sort;
			}
		}

		const { sort, ...query } = this.defaultQuery || {};

		// execute is set to false at the time of mount
		// to avoid firing (multiple) partial queries.
		// Hence we are building the query in parts here
		// and only executing it with setReact() at core
		const execute = false;

		this.props.setQueryOptions(this.props.componentId, options, execute);

		if (this.defaultQuery) {
			this.props.updateQuery(
				{
					componentId: this.internalComponent,
					query,
				},
				execute,
			);
		} else {
			this.props.updateQuery(
				{
					componentId: this.internalComponent,
					query: null,
				},
				execute,
			);
		}

		// query will be executed here
		this.setReact(this.props);
	}

	componentWillReceiveProps(nextProps) {
		if (
			!isEqual(this.props.sortOptions, nextProps.sortOptions)
			|| this.props.sortBy !== nextProps.sortBy
			|| this.props.size !== nextProps.size
			|| !isEqual(this.props.dataField, nextProps.dataField)
			|| !isEqual(this.props.includeFields, nextProps.includeFields)
			|| !isEqual(this.props.excludeFields, nextProps.excludeFields)
		) {
			const options = getQueryOptions(nextProps);
			options.from = this.state.from;
			if (nextProps.sortOptions) {
				options.sort = [
					{
						[nextProps.sortOptions[0].dataField]: {
							order: nextProps.sortOptions[0].sortBy,
						},
					},
				];
			} else if (nextProps.sortBy) {
				options.sort = [
					{
						[nextProps.dataField]: {
							order: nextProps.sortBy,
						},
					},
				];
			}
			this.props.setQueryOptions(this.props.componentId, options, true);
		}

		if (nextProps.defaultQuery && !isEqual(nextProps.defaultQuery(), this.defaultQuery)) {
			const options = getQueryOptions(nextProps);
			options.from = 0;
			this.defaultQuery = nextProps.defaultQuery();

			const { sort, ...query } = this.defaultQuery;

			if (sort) {
				options.sort = this.defaultQuery.sort;
				nextProps.setQueryOptions(nextProps.componentId, options, !query);
			}

			this.props.updateQuery(
				{
					componentId: this.internalComponent,
					query,
				},
				true,
			);

			// reset page because of query change
			this.setState(
				{
					currentPage: 0,
					from: 0,
				},
				() => {
					this.updatePageURL(0);
				},
			);
		}

		if (this.props.stream !== nextProps.stream) {
			this.props.setStreaming(nextProps.componentId, nextProps.stream);
		}

		if (!isEqual(nextProps.react, this.props.react)) {
			this.setReact(nextProps);
		}

		if (
			!nextProps.pagination
			&& this.props.hits
			&& nextProps.hits
			&& (this.props.hits.length < nextProps.hits.length
				|| nextProps.hits.length === nextProps.total)
		) {
			this.setState({
				isLoading: false,
			});
		}

		if (
			!nextProps.pagination
			&& nextProps.hits
			&& this.props.hits
			&& nextProps.hits.length < this.props.hits.length
		) {
			if (this.listRef) {
				this.listRef.scrollToOffset({ x: 0, y: 0, animated: false });
			}
			this.setState({
				from: 0,
				isLoading: false,
			});
		}

		if (nextProps.pagination && nextProps.total !== this.props.total) {
			this.setState({
				totalPages: nextProps.total / nextProps.size,
				currentPage: 0,
			});
		}
	}

	componentWillUnmount() {
		this.props.removeComponent(this.props.componentId);
	}

	updatePageURL = (page) => {
		if (this.props.URLParams) {
			this.props.setPageURL(
				this.props.componentId,
				page + 1,
				this.props.componentId,
				false,
				true,
			);
		}
	};

	setReact = (props) => {
		const { react } = props;
		if (react) {
			const newReact = pushToAndClause(react, this.internalComponent);
			props.watchComponent(props.componentId, newReact);
		} else {
			props.watchComponent(props.componentId, { and: this.internalComponent });
		}
	};

	loadMore = () => {
		if (
			this.props.hits
			&& !this.props.pagination
			&& this.props.total !== this.props.hits.length
		) {
			const value = this.state.from + this.props.size;
			const options = getQueryOptions(this.props);

			this.setState({
				from: value,
				isLoading: true,
			});
			this.props.loadMore(
				this.props.componentId,
				{
					...options,
					from: value,
				},
				true,
			);
		} else if (this.state.isLoading) {
			this.setState({
				isLoading: false,
			});
		}
	};

	setPage = (page) => {
		const value = this.props.size * page;
		const options = getQueryOptions(this.props);
		this.setState({
			from: value,
			isLoading: true,
			currentPage: page,
		});
		this.props.loadMore(
			this.props.componentId,
			{
				...options,
				from: value,
			},
			false,
		);
	};

	prevPage = () => {
		if (this.state.currentPage) {
			this.setPage(this.state.currentPage - 1);
		}
	};

	nextPage = () => {
		if (this.state.currentPage < this.state.totalPages - 1) {
			this.setPage(this.state.currentPage + 1);
		}
	};

	getStart = () => {
		const midValue = parseInt(this.props.pages / 2, 10);
		const start = this.state.currentPage - midValue;
		return start > 1 ? start : 2;
	};

	renderPagination = () => {
		const start = this.getStart();
		const pages = [];

		for (let i = start; i < (start + this.props.pages) - 1; i += 1) {
			const activeStyles = {
				button: {},
				text: {},
			};

			if (this.state.currentPage === i - 1) {
				activeStyles.button = {
					backgroundColor: this.props.theming.primaryColor,
				};
				activeStyles.text = {
					color: this.props.theming.primaryTextColor,
				};
			}

			const pageBtn = (
				<Button
					key={i - 1}
					onPress={() => this.setPage(i - 1)}
					light={this.state.currentPage !== i - 1}
					style={{
						...activeStyles.button,
						...getInnerKey(this.props.innerStyle, 'button'),
					}}
				>
					<Text
						style={{
							...activeStyles.text,
							...getInnerKey(this.props.innerStyle, 'label'),
						}}
					>
						{i}
					</Text>
				</Button>
			);
			if (i <= this.state.totalPages + 1) {
				pages.push(pageBtn);
			}
		}

		if (!this.state.totalPages) {
			return null;
		}

		const primaryStyles = {
			button: {},
			text: {},
		};

		if (this.state.currentPage === 0) {
			primaryStyles.button = {
				backgroundColor: this.props.theming.primaryColor,
			};
			primaryStyles.text = {
				color: this.props.theming.primaryTextColor,
			};
		}

		return (
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					marginTop: 20,
					marginBottom: 20,
				}}
			>
				<Button
					light={this.state.currentPage !== 0}
					disabled={this.state.currentPage === 0}
					onPress={this.prevPage}
					style={getInnerKey(this.props.innerStyle, 'button')}
					{...getInnerKey(this.props.innerProps, 'button')}
				>
					<Icon
						name="ios-arrow-back"
						style={getInnerKey(this.props.innerStyle, 'icon')}
						{...getInnerKey(this.props.innerProps, 'icon')}
					/>
				</Button>
				{
					<Button
						onPress={() => this.setPage(0)}
						light={this.state.currentPage !== 0}
						style={{
							...primaryStyles.button,
							...getInnerKey(this.props.innerStyle, 'button'),
						}}
						{...getInnerKey(this.props.innerProps, 'button')}
					>
						<Text
							style={{
								...primaryStyles.text,
								...getInnerKey(this.props.innerStyle, 'label'),
							}}
							{...getInnerKey(this.props.innerProps, 'text')}
						>
							1
						</Text>
					</Button>
				}
				{this.state.currentPage >= this.props.pages ? (
					<View
						style={{
							height: 45,
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<Text
							style={getInnerKey(this.props.innerStyle, 'label')}
							{...getInnerKey(this.props.innerProps, 'text')}
						>
							...
						</Text>
					</View>
				) : null}
				{pages}
				<Button
					onPress={this.nextPage}
					light={this.state.currentPage < this.state.totalPages - 1}
					disabled={this.state.currentPage >= this.state.totalPages - 1}
					style={getInnerKey(this.props.innerStyle, 'button')}
					{...getInnerKey(this.props.innerProps, 'button')}
				>
					<Icon
						name="ios-arrow-forward"
						style={getInnerKey(this.props.innerStyle, 'icon')}
						{...getInnerKey(this.props.innerProps, 'icon')}
					/>
				</Button>
			</View>
		);
	};

	setRef = (node) => {
		this.listRef = node;
	};

	renderResultStats = () => {
		if (this.props.onResultStats && this.props.total) {
			return this.props.onResultStats(this.props.total, this.props.time);
		} else if (this.props.total) {
			return (
				<Text {...getInnerKey(this.props.innerProps, 'text')}>
					{this.props.total} results found in {this.props.time}ms
				</Text>
			);
		}
		return null;
	};

	renderNoResults = () => {
		const type = typeof this.props.onNoResults;
		if (type === 'function') {
			return this.props.onNoResults();
		}
		return (
			<Text {...getInnerKey(this.props.innerProps, 'noResults')}>
				{type === 'string' ? this.props.onNoResults : 'No results found.'}
			</Text>
		);
	};

	render() {
		const results = parseHits(this.props.hits) || [];
		const streamResults = parseHits(this.props.streamHits) || [];
		let filteredResults = results;

		if (streamResults.length) {
			const ids = streamResults.map(item => item._id);
			filteredResults = filteredResults.filter(item => !ids.includes(item._id));
		}

		return (
			<View style={this.props.style}>
				{this.props.showResultStats ? this.renderResultStats() : null}
				{this.props.pagination && this.props.paginationAt === 'top'
					? this.renderPagination()
					: null}
				{!this.state.isLoading && (results.length === 0 && streamResults.length === 0)
					? this.renderNoResults()
					: null}
				{this.props.onAllData ? (
					this.props.onAllData(results, streamResults, this.loadMore)
				) : (
					<List
						setRef={this.setRef}
						data={[...streamResults, ...filteredResults]}
						onData={this.props.onData}
						onEndReached={this.loadMore}
						innerProps={this.props.innerProps}
					/>
				)}
				{this.state.isLoading && !this.props.pagination ? (
					<View>
						<Spinner {...getInnerKey(this.props.innerProps, 'spinner')} />
					</View>
				) : null}
				{this.props.pagination && this.props.paginationAt === 'bottom'
					? this.renderPagination()
					: null}
			</View>
		);
	}
}

ReactiveList.propTypes = {
	addComponent: types.funcRequired,
	removeComponent: types.funcRequired,
	setStreaming: types.func,
	setQueryOptions: types.funcRequired,
	setQueryListener: types.funcRequired,
	updateQuery: types.funcRequired,
	loadMore: types.funcRequired,
	// component props
	componentId: types.stringRequired,
	dataField: types.stringRequired,
	defaultQuery: types.func,
	excludeFields: types.excludeFields,
	hits: types.hits,
	innerProps: types.props,
	innerStyle: types.style,
	isLoading: types.bool,
	includeFields: types.includeFields,
	onAllData: types.func,
	onData: types.func,
	onNoResults: types.title,
	onQueryChange: types.func,
	onError: types.func,
	onResultStats: types.func,
	pages: types.number,
	pagination: types.bool,
	paginationAt: types.paginationAt,
	react: types.react,
	showResultStats: types.bool,
	size: types.number,
	sortBy: types.sortBy,
	stream: types.bool,
	streamHits: types.hits,
	style: types.style,
	theming: types.style,
	time: types.number,
	total: types.number,
};

ReactiveList.defaultProps = {
	pagination: false,
	pages: 5,
	size: 10,
};

ReactiveList.defaultProps = {
	onNoResults: 'No Results found.',
	pages: 5,
	pagination: false,
	paginationAt: 'bottom',
	showResultStats: true,
	size: 10,
	style: {},
	includeFields: ['*'],
	excludeFields: [],
};

const mapStateToProps = (state, props) => ({
	hits: state.hits[props.componentId] && state.hits[props.componentId].hits,
	streamHits: state.streamHits[props.componentId] || [],
	total: state.hits[props.componentId] && state.hits[props.componentId].total,
	time: (state.hits[props.componentId] && state.hits[props.componentId].time) || 0,
	isLoading: state.isLoading[props.componentId] || false,
	url: state.config.url,
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	setStreaming: (component, stream) => dispatch(setStreaming(component, stream)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	setQueryOptions: (component, props, execute) =>
		dispatch(setQueryOptions(component, props, execute)),
	setQueryListener: (component, onQueryChange, beforeQueryChange) =>
		dispatch(setQueryListener(component, onQueryChange, beforeQueryChange)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	loadMore: (component, options, append) => dispatch(loadMore(component, options, append)),
});

export default connect(
	mapStateToProps,
	mapDispatchtoProps,
)(withTheme(ReactiveList));
