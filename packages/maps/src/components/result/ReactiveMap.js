import React, { Component } from 'react';
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import {
	addComponent,
	removeComponent,
	setStreaming,
	watchComponent,
	setQueryOptions,
	updateQuery,
	loadMore,
} from '@appbaseio/reactivecore/lib/actions';
import {
	isEqual,
	getQueryOptions,
	pushToAndClause,
	getClassName,
	parseHits,
} from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';

import Title from '@appbaseio/reactivesearch/lib/styles/Title';
import Dropdown from '@appbaseio/reactivesearch/lib/components/shared/Dropdown';
import { connect } from '@appbaseio/reactivesearch/lib/utils';
import Pagination from '@appbaseio/reactivesearch/lib/components/result/addons/Pagination';

const Standard = require('./addons/styles/Standard');
const BlueEssence = require('./addons/styles/BlueEssence');
const BlueWater = require('./addons/styles/BlueWater');
const FlatMap = require('./addons/styles/FlatMap');
const LightMonochrome = require('./addons/styles/LightMonochrome');
const MidnightCommander = require('./addons/styles/MidnightCommander');
const UnsaturatedBrowns = require('./addons/styles/UnsaturatedBrowns');

const MapComponent = (withGoogleMap((props) => {
	const { children, onMapMounted, ...allProps } = props;

	return (
		<GoogleMap
			defaultZoom={8}
			ref={onMapMounted}
			{...allProps}
		>
			{children}
		</GoogleMap>
	);
}));

class ReactiveMap extends Component {
	constructor(props) {
		super(props);

		this.mapStyles = [
			{ label: 'Standard', value: Standard },
			{ label: 'Blue Essence', value: BlueEssence },
			{ label: 'Blue Water', value: BlueWater },
			{ label: 'Flat Map', value: FlatMap },
			{ label: 'Light Monochrome', value: LightMonochrome },
			{ label: 'Midnight Commander', value: MidnightCommander },
			{ label: 'Unsaturated Browns', value: UnsaturatedBrowns },
		];

		this.state = {
			currentMapStyle: this.mapStyles[0],
			from: props.currentPage * props.size,
			isLoading: false,
			totalPages: 0,
			currentPage: props.currentPage,
		};
		this.mapRef = null;
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
		if (this.props.sortBy) {
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
	}

	componentWillReceiveProps(nextProps) {
		if (
			this.props.sortBy !== nextProps.sortBy
			|| this.props.size !== nextProps.size
			|| !isEqual(this.props.dataField, nextProps.dataField)
		) {
			const options = getQueryOptions(nextProps);
			options.from = this.state.from;
			if (nextProps.sortBy) {
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
		if (this.props.pagination && this.state.isLoading) {
			this.setState({
				isLoading: false,
			});
		}

		if (
			!nextProps.pagination
			&& this.props.hits
			&& nextProps.hits
			&& (
				this.props.hits.length < nextProps.hits.length
				|| nextProps.hits.length === nextProps.total
			)
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
			this.setState({
				from: 0,
				isLoading: false,
			});
		}

		if (nextProps.pagination && nextProps.total !== this.props.total) {
			this.setState({
				totalPages: Math.ceil(nextProps.total / nextProps.size),
				currentPage: this.props.total ? 0 : this.state.currentPage,
			});
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (!isEqual(this.state.currentMapStyle, nextState.currentMapStyle)) {
			return true;
		}

		if (
			isEqual(this.props.hits, nextProps.hits)
			&& isEqual(this.props.streamHits, nextProps.streamHits)
		) {
			return false;
		}

		return true;
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

	getIcon = (result) => {
		if (this.props.renderMapPin) {
			return this.props.renderMapPin(result);
		}
		return this.props.mapPin;
	};

	getPosition = (result) => {
		if (result) {
			return this.parseLocation(result[this.props.dataField]);
		}
		return null;
	};

	parseLocation(location) {
		if (Array.isArray(location)) {
			return {
				lat: Number(location[0]),
				lng: Number(location[1]),
			};
		}
		return {
			lat: location ? Number(location.lat) : null,
			lng: location ? Number(location.lon === undefined ? location.lng : location.lon) : null,
		};
	}

	setMapStyle = (currentMapStyle) => {
		this.setState({
			currentMapStyle,
		});
	};

	render() {
		const results = parseHits(this.props.hits) || [];
		const streamResults = parseHits(this.props.streamHits) || [];
		let filteredResults = results;

		if (streamResults.length) {
			const ids = streamResults.map(item => item._id);
			filteredResults = filteredResults.filter(item => !ids.includes(item._id));
		}

		const Map = () => (
			<div style={{ position: 'relative' }}>
				<MapComponent
					onMapMounted={(ref) => {
						this.mapRef = ref;
					}}
					containerElement={<div style={{ height: '100vh' }} />}
					mapElement={<div style={{ height: '100%' }} />}
					center={
						filteredResults[0] && filteredResults[0][this.props.dataField]
							? this.getPosition(filteredResults[0])
							: this.parseLocation(this.props.defaultCenter)
					}
					options={{
						styles: this.state.currentMapStyle.value,
					}}
				>
					{
						[...streamResults, ...filteredResults].map((item) => {
							const icon = this.getIcon(item);
							const position = this.getPosition(item);
							return (
								<Marker
									key={item._id}
									icon={icon}
									position={position}
								/>
							);
						})
					}
				</MapComponent>
				{
					this.props.showMapStyles
						? (
							<div
								style={{
									position: 'absolute',
									top: 10,
									right: 46,
									width: 120,
								}}
							>
								<Dropdown
									innerClass={this.props.innerClass}
									items={this.mapStyles}
									onChange={this.setMapStyle}
									selectedItem={this.state.currentMapStyle}
									keyField="label"
									returnsObject
									small
								/>
							</div>
						)
						: null
				}
			</div>
		);

		const PaginationComponent = () => (
			<Pagination
				pages={this.props.pages}
				totalPages={this.state.totalPages}
				currentPage={this.state.currentPage}
				setPage={this.setPage}
				innerClass={this.props.innerClass}
			/>
		);

		return (
			<div style={this.props.style} className={this.props.className}>
				{
					this.props.onAllData
						? this.props.onAllData(
							this.props.hits,
							this.props.streamHits,
							this.loadMore,
							Map,
							PaginationComponent,
						)
						: <Map />
				}
			</div>
		);
	}
}

ReactiveMap.propTypes = {
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
	onAllData: types.func,
	pages: types.number,
	pagination: types.bool,
	react: types.react,
	size: types.number,
	sortBy: types.sortBy,
	sortOptions: types.sortOptions,
	stream: types.bool,
	style: types.style,
	URLParams: types.bool,
	mapPin: types.string,
	renderMapPin: types.func,
	defaultCenter: types.location,
	showMapStyles: types.bool,
};

ReactiveMap.defaultProps = {
	size: 10,
	style: {},
	className: null,
	showMapStyles: true,
	defaultCenter: {
		lat: -34.397,
		lng: 150.644,
	},
};

const mapStateToProps = (state, props) => ({
	hits: state.hits[props.componentId] && state.hits[props.componentId].hits,
	streamHits: state.streamHits[props.componentId] || [],
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	setStreaming: (component, stream) => dispatch(setStreaming(component, stream)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	setQueryOptions: (component, props, execute) =>
		dispatch(setQueryOptions(component, props, execute)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	loadMore: (component, options, append) => dispatch(loadMore(component, options, append)),
});

export default connect(mapStateToProps, mapDispatchtoProps)(ReactiveMap);
