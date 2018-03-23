import React, { Component } from 'react';

import {
	addComponent,
	removeComponent,
	setStreaming,
	watchComponent,
	setQueryOptions,
	updateQuery,
	loadMore,
	setValue,
} from '@appbaseio/reactivecore/lib/actions';
import {
	isEqual,
	getQueryOptions,
	pushToAndClause,
	getClassName,
	parseHits,
} from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';

import Pagination from './addons/Pagination';
import PoweredBy from './addons/PoweredBy';

import Title from '../../styles/Title';
import Card, { container, Image } from '../../styles/Card';
import Flex from '../../styles/Flex';
import { resultStats, sortOptions } from '../../styles/results';
import { connect } from '../../utils';

class ResultCard extends Component {
	constructor(props) {
		super(props);

		let currentPage = 0;
		if (this.props.defaultPage >= 0) {
			currentPage = this.props.defaultPage;
		} else if (this.props.currentPage) {
			currentPage = Math.max(this.props.currentPage - 1, 0);
		}

		this.state = {
			from: props.currentPage * props.size,
			isLoading: false,
			currentPage,
		};
		this.internalComponent = `${props.componentId}__internal`;
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
			options.sort = [{
				[this.props.sortOptions[0].dataField]: {
					order: this.props.sortOptions[0].sortBy,
				},
			}];
		} else if (this.props.sortBy) {
			options.sort = [{
				[this.props.dataField]: {
					order: this.props.sortBy,
				},
			}];
		}

		// Override sort query with defaultQuery's sort if defined
		this.defaultQuery = null;
		if (this.props.defaultQuery) {
			this.defaultQuery = this.props.defaultQuery();
			if (this.defaultQuery.sort) {
				options.sort = this.defaultQuery.sort;
			}
		}

		this.props.setQueryOptions(
			this.props.componentId,
			options,
			!(this.defaultQuery && this.defaultQuery.query),
		);
		this.setReact(this.props);

		if (this.defaultQuery) {
			const { sort, ...query } = this.defaultQuery;
			this.props.updateQuery({
				componentId: this.internalComponent,
				query,
			});
		} else {
			this.props.updateQuery({
				componentId: this.internalComponent,
				query: null,
			});
		}

		if (!this.props.pagination) {
			window.addEventListener('scroll', this.scrollHandler);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (
			!isEqual(this.props.sortOptions, nextProps.sortOptions)
			|| this.props.sortBy !== nextProps.sortBy
			|| this.props.size !== nextProps.size
			|| !isEqual(this.props.dataField, nextProps.dataField)
		) {
			const options = getQueryOptions(nextProps);
			options.from = this.state.from;
			if (nextProps.sortOptions) {
				options.sort = [{
					[nextProps.sortOptions[0].dataField]: {
						order: nextProps.sortOptions[0].sortBy,
					},
				}];
			} else if (nextProps.sortBy) {
				options.sort = [{
					[nextProps.dataField]: {
						order: nextProps.sortBy,
					},
				}];
			}
			this.props.setQueryOptions(this.props.componentId, options, true);
		}

		if (
			nextProps.defaultQuery
			&& !isEqual(nextProps.defaultQuery(), this.defaultQuery)
		) {
			const options = getQueryOptions(nextProps);
			options.from = this.state.from;
			this.defaultQuery = nextProps.defaultQuery();

			const { sort, ...query } = this.defaultQuery;

			if (sort) {
				options.sort = this.defaultQuery.sort;
				nextProps.setQueryOptions(nextProps.componentId, options, !query);
			}

			this.props.updateQuery({
				componentId: this.internalComponent,
				query,
			});
		}

		if (this.props.stream !== nextProps.stream) {
			this.props.setStreaming(nextProps.componentId, nextProps.stream);
		}

		if (!isEqual(nextProps.react, this.props.react)) {
			this.setReact(nextProps);
		}

		// called when page is changed
		if (this.props.pagination) {
			if (this.state.isLoading) {
				if (nextProps.onPageChange) {
					nextProps.onPageChange(this.state.currentPage + 1, this.state.totalPages);
				} else {
					window.scrollTo(0, 0);
				}
				this.setState({
					isLoading: false,
				});
			}
			if (this.props.currentPage !== nextProps.currentPage
					&& nextProps.currentPage > 0
					&& nextProps.currentPage <= this.state.totalPages) {
				this.setPage(nextProps.currentPage - 1);
			}
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
			if (nextProps.onPageChange) {
				nextProps.onPageChange(this.state.currentPage + 1, this.state.totalPages);
			} else {
				window.scrollTo(0, 0);
			}
			this.setState({
				from: 0,
				isLoading: false,
			});
		}

		if (nextProps.pagination && nextProps.total !== this.props.total) {
			const totalPages = Math.ceil(nextProps.total / nextProps.size);
			const currentPage = this.props.total ? 0 : this.state.currentPage;
			this.setState({
				currentPage,
			});

			if (nextProps.onPageChange) {
				nextProps.onPageChange(currentPage + 1, this.state.totalPages);
			}
		}

		if (nextProps.pagination !== this.props.pagination) {
			if (nextProps.pagination) {
				window.addEventListener('scroll', this.scrollHandler);
			} else {
				window.removeEventListener('scroll', this.scrollHandler);
			}
		}
	}

	componentWillUnmount() {
		this.props.removeComponent(this.props.componentId);
		this.props.removeComponent(this.internalComponent);
	}

	setReact = (props) => {
		const { react } = props;
		if (react) {
			const newReact = pushToAndClause(react, this.internalComponent);
			props.watchComponent(props.componentId, newReact);
		} else {
			props.watchComponent(props.componentId, { and: this.internalComponent });
		}
	};

	scrollHandler = () => {
		if (
			!this.state.isLoading
			&& (window.innerHeight + window.scrollY + 300) >= document.body.offsetHeight
		) {
			this.loadMore();
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
			this.props.loadMore(this.props.componentId, {
				...options,
				from: value,
			}, true);
		} else if (this.state.isLoading) {
			this.setState({
				isLoading: false,
			});
		}
	};

	setPage = (page) => {
		const value = this.props.size * page;
		const options = getQueryOptions(this.props);
		options.from = this.state.from;
		this.setState({
			from: value,
			isLoading: true,
			currentPage: page,
		});
		this.props.loadMore(this.props.componentId, {
			...options,
			from: value,
		}, false);

		if (this.props.URLParams) {
			this.props.setPageURL(
				`${this.props.componentId}-page`,
				page + 1,
				`${this.props.componentId}-page`,
				false,
				true,
			);
		}
	};

	renderAsCard = (item) => {
		const result = this.props.onData(item);

		if (result) {
			return (
				<Card
					key={item._id}
					href={result.url}
					className={getClassName(this.props.innerClass, 'listItem')}
					target={this.props.target}
					rel={this.props.target === '_blank' ? 'noopener noreferrer' : null}
				>
					<Image
						style={{ backgroundImage: `url(${result.image})` }}
						className={getClassName(this.props.innerClass, 'image')}
					/>
					{
						typeof result.title === 'string'
							? <Title
								dangerouslySetInnerHTML={{ __html: result.title }}
								className={getClassName(this.props.innerClass, 'title')}
							/>
							: (
								<Title className={getClassName(this.props.innerClass, 'title')}>
									{result.title}
								</Title>
							)
					}
					{
						typeof result.description === 'string'
							? <article dangerouslySetInnerHTML={{ __html: result.description }} />
							: <article>{result.description}</article>
					}
				</Card>
			);
		}

		return null;
	};

	renderResultStats = () => {
		if (this.props.onResultStats && this.props.total) {
			return this.props.onResultStats(this.props.total, this.props.time);
		} else if (this.props.total) {
			return (
				<p className={`${resultStats} ${getClassName(this.props.innerClass, 'resultStats')}`}>
					{this.props.total} results found in {this.props.time}ms
				</p>
			);
		}
		return null;
	};

	handleSortChange = (e) => {
		const index = e.target.value;
		const options = getQueryOptions(this.props);
		options.from = this.state.from;

		options.sort = [{
			[this.props.sortOptions[index].dataField]: {
				order: this.props.sortOptions[index].sortBy,
			},
		}];
		this.props.setQueryOptions(this.props.componentId, options, true);
	};

	renderSortOptions = () => (
		<select
			className={`${sortOptions} ${getClassName(this.props.innerClass, 'sortOptions')}`}
			name="sort-options"
			onChange={this.handleSortChange}
		>
			{
				this.props.sortOptions.map((sort, index) => (
					<option key={sort.label} value={index}>{sort.label}</option>
				))
			}
		</select>
	);

	render() {
		const results = parseHits(this.props.hits) || [];
		const streamResults = parseHits(this.props.streamHits) || [];
		let filteredResults = results;

		if (streamResults.length) {
			const ids = streamResults.map(item => item._id);
			filteredResults = filteredResults.filter(item => !ids.includes(item._id));
		}

		return (
			<div style={this.props.style} className={this.props.className}>
				{this.props.isLoading && this.props.pagination && this.props.loader && this.props.loader}
				<Flex
					labelPosition={this.props.sortOptions ? 'right' : 'left'}
					className={getClassName(this.props.innerClass, 'resultsInfo')}
				>
					{
						this.props.sortOptions
							? this.renderSortOptions()
							: null
					}
					{
						this.props.showResultStats
							? this.renderResultStats()
							: null
					}
				</Flex>
				{
					this.props.pagination && (
						this.props.paginationAt === 'top'
						|| this.props.paginationAt === 'both'
					)
						? (<Pagination
							pages={this.props.pages}
							totalPages={Math.ceil(this.props.total / this.props.size)}
							currentPage={this.state.currentPage}
							setPage={this.setPage}
							innerClass={this.props.innerClass}
						/>)
						: null
				}
				<div className={`${container} ${getClassName(this.props.innerClass, 'list')}`}>
					{
						[...streamResults, ...filteredResults].map(item => this.renderAsCard(item))
					}
				</div>
				{
					this.state.isLoading && !this.props.pagination
						? this.props.loader || (
							<div style={{ textAlign: 'center', margin: '20px 0', color: '#666' }}>
								Loading...
							</div>
						)
						: null
				}
				{
					this.props.pagination && (
						this.props.paginationAt === 'bottom'
						|| this.props.paginationAt === 'both'
					)
						? (<Pagination
							pages={this.props.pages}
							totalPages={Math.ceil(this.props.total / this.props.size)}
							currentPage={this.state.currentPage}
							setPage={this.setPage}
							innerClass={this.props.innerClass}
						/>)
						: null
				}
				{
					this.props.url.endsWith('appbase.io') && results.length
						? (
							<Flex direction="row-reverse" className={getClassName(this.props.innerClass, 'poweredBy')}>
								<PoweredBy />
							</Flex>
						)
						: null
				}
			</div>
		);
	}
}

ResultCard.propTypes = {
	addComponent: types.funcRequired,
	loadMore: types.funcRequired,
	removeComponent: types.funcRequired,
	setPageURL: types.func,
	setQueryOptions: types.funcRequired,
	setStreaming: types.func,
	updateQuery: types.funcRequired,
	watchComponent: types.funcRequired,
	currentPage: types.number,
	hits: types.hits,
	isLoading: types.bool,
	streamHits: types.hits,
	time: types.number,
	total: types.number,
	url: types.string,
	// component props
	className: types.string,
	componentId: types.stringRequired,
	dataField: types.stringRequired,
	defaultQuery: types.func,
	innerClass: types.style,
	loader: types.title,
	onData: types.func,
	onResultStats: types.func,
	pages: types.number,
	pagination: types.bool,
	paginationAt: types.paginationAt,
	react: types.react,
	showResultStats: types.bool,
	size: types.number,
	sortBy: types.sortBy,
	sortOptions: types.sortOptions,
	stream: types.bool,
	style: types.style,
	target: types.stringRequired,
	URLParams: types.bool,
	onPageChange: types.func,
	defaultPage: types.number,
};

ResultCard.defaultProps = {
	className: null,
	pages: 5,
	pagination: false,
	paginationAt: 'bottom',
	showResultStats: true,
	size: 10,
	style: {},
	target: '_blank',
	URLParams: false,
	currentPage: 0,
};

const mapStateToProps = (state, props) => ({
	defaultPage: (
		state.selectedValues[`${props.componentId}-page`]
		&& state.selectedValues[`${props.componentId}-page`].value - 1
	) || -1,
	hits: state.hits[props.componentId] && state.hits[props.componentId].hits,
	isLoading: state.isLoading[props.componentId] || false,
	streamHits: state.streamHits[props.componentId] || [],
	time: (state.hits[props.componentId] && state.hits[props.componentId].time) || 0,
	total: state.hits[props.componentId] && state.hits[props.componentId].total,
	url: state.config.url,
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	loadMore: (component, options, append) => dispatch(loadMore(component, options, append)),
	removeComponent: component => dispatch(removeComponent(component)),
	setPageURL: (component, value, label, showFilter, URLParams) =>
		dispatch(setValue(component, value, label, showFilter, URLParams)),
	setQueryOptions: (component, props, execute) =>
		dispatch(setQueryOptions(component, props, execute)),
	setStreaming: (component, stream) => dispatch(setStreaming(component, stream)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
});

export default connect(mapStateToProps, mapDispatchtoProps)(ResultCard);
