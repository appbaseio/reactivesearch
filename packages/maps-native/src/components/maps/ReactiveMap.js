import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button, Icon } from 'native-base';
import { MapView } from 'expo';

import {
	addComponent,
	removeComponent,
	setStreaming,
	watchComponent,
	setQueryOptions,
	updateQuery,
	loadMore,
	setMapData,
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
import { connect } from '../../utils';
import MarkerWithLabel from './addons/MarkerWithLabel';

const Standard = require('./addons/styles/Standard');
const BlueEssence = require('./addons/styles/BlueEssence');
const BlueWater = require('./addons/styles/BlueWater');
const FlatMap = require('./addons/styles/FlatMap');
const LightMonochrome = require('./addons/styles/LightMonochrome');
const MidnightCommander = require('./addons/styles/MidnightCommander');
const UnsaturatedBrowns = require('./addons/styles/UnsaturatedBrowns');

const styles = StyleSheet.create({
	map: {
		...StyleSheet.absoluteFill,
		flex: 1,
	},
});

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

		const currentMapStyle
			= this.mapStyles.find(style => style.label === props.defaultMapStyle)
			|| this.mapStyles[0];

		this.state = {
			currentMapStyle,
			from: props.currentPage * props.size || 0,
			isLoading: false,
			totalPages: 0,
			currentPage: props.currentPage,
		};
		this.internalComponent = `${props.componentId}__internal`;
		props.setQueryListener(props.componentId, props.onQueryChange, null);
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
			options.sort = [
				{
					[this.props.dataField]: {
						order: this.props.sortBy,
					},
				},
			];
		}

		this.defaultQuery = null;
		if (this.props.defaultQuery) {
			this.defaultQuery = this.props.defaultQuery();
			// Override sort query with defaultQuery's sort if defined
			if (this.defaultQuery.sort) {
				options.sort = this.defaultQuery.sort;
			}
			this.props.setMapData(
				this.props.componentId,
				this.defaultQuery.query,
				!!this.defaultQuery.query,
			);
		}

		this.props.setQueryOptions(
			this.props.componentId,
			options,
			!(this.defaultQuery && this.defaultQuery.query),
		);
		this.setReact(this.props);
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
			options.from = this.state.from;
			this.defaultQuery = nextProps.defaultQuery();

			const { sort, query } = this.defaultQuery;

			if (sort) {
				options.sort = this.defaultQuery.sort;
				nextProps.setQueryOptions(nextProps.componentId, options, !query);
			}

			this.props.setMapData(this.props.componentId, query, !!query);
		}

		if (this.props.stream !== nextProps.stream) {
			this.props.setStreaming(nextProps.componentId, nextProps.stream);
		}

		if (!isEqual(nextProps.react, this.props.react)) {
			this.setReact(nextProps);
		}

		// called when page is changed
		if (this.props.pagination && this.state.isLoading) {
			if (nextProps.onPageChange) {
				nextProps.onPageChange();
			}
			this.setState({
				isLoading: false,
			});
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
				nextProps.onPageChange();
			}
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

		if (this.props.defaultMapStyle !== nextProps.defaultMapStyle) {
			this.setState({
				currentMapStyle:
					this.mapStyles.find(style => style.label === nextProps.defaultMapStyle)
					|| this.mapStyles[0],
			});
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

	getHitsCenter = (hits) => {
		const data = hits.map(hit => hit[this.props.dataField]);

		if (data.length) {
			const numCoords = data.length;

			let X = 0.0;
			let Y = 0.0;
			let Z = 0.0;

			data.forEach((location) => {
				if (location) {
					let lat = 0.0;
					let lng = 0.0;

					if (Array.isArray(location)) {
						lat = (location[0] * Math.PI) / 180;
						lng = (location[1] * Math.PI) / 180;
					} else {
						lat = (location.lat * Math.PI) / 180;
						lng
							= ((location.lng !== undefined ? location.lng : location.lon) * Math.PI)
							/ 180;
					}

					const a = Math.cos(lat) * Math.cos(lng);
					const b = Math.cos(lat) * Math.sin(lng);
					const c = Math.sin(lat);

					X += a;
					Y += b;
					Z += c;
				}
			});

			X /= numCoords;
			Y /= numCoords;
			Z /= numCoords;

			const lng = Math.atan2(Y, X);
			const hyp = Math.sqrt((X * X) + (Y * Y));
			const lat = Math.atan2(Z, hyp);

			const newX = (lat * 180) / Math.PI;
			const newY = (lng * 180) / Math.PI;

			return {
				lat: newX,
				lng: newY,
			};
		}
		return false;
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
		options.from = this.state.from;
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
			lat: location ? Number(location.lat) : this.props.defaultCenter.lat,
			lng: location
				? Number(location.lon === undefined ? location.lng : location.lon)
				: this.props.defaultCenter.lng,
		};
	}

	setMapStyle = (currentMapStyle) => {
		this.setState({
			currentMapStyle,
		});
	};

	getCenter = (hits) => {
		if (this.props.center) {
			return this.parseLocation(this.props.center);
		}

		if (hits && hits.length) {
			if (this.props.autoCenter || this.props.streamAutoCenter) {
				return this.getHitsCenter(hits) || this.parseLocation(this.props.defaultCenter);
			}
			return hits[0] && hits[0][this.props.dataField]
				? this.getPosition(hits[0])
				: this.parseLocation(this.props.defaultCenter);
		}

		return this.parseLocation(this.props.defaultCenter);
	};

	getRegion = (hitsToRender) => {
		const center = this.getCenter(hitsToRender);
		return {
			latitude: center.lat,
			longitude: center.lng,
			latitudeDelta: this.props.defaultZoom,
			longitudeDelta: this.props.defaultZoom,
		};
	};

	renderMap = () => {
		const results = parseHits(this.props.hits) || [];
		const streamResults = parseHits(this.props.streamHits) || [];
		let filteredResults = results;

		if (streamResults.length) {
			const ids = streamResults.map(item => item._id);
			filteredResults = filteredResults.filter(item => !ids.includes(item._id));
		}

		const resultsToRender = [...streamResults, ...filteredResults];
		let markers = [];

		if (this.props.showMarkers) {
			markers = resultsToRender.map((item) => {
				const { lat, lng } = this.getPosition(item);
				const markerProps = {
					key: item._id,
					coordinate: {
						latitude: lat,
						longitude: lng,
					},
				};

				if (this.props.onData) {
					const data = this.props.onData(item);

					if ('label' in data) {
						return (
							<MapView.Marker {...markerProps} {...this.props.markerProps}>
								<MarkerWithLabel label={data.label} />
							</MapView.Marker>
						);
					} else if ('icon' in data) {
						markerProps.image = data.icon;
					} else {
						return (
							<MapView.Marker {...markerProps} {...this.props.markerProps}>
								{data.custom}
							</MapView.Marker>
						);
					}
				} else if (this.props.defaultPin) {
					markerProps.image = this.props.defaultPin;
				}

				return (
					<MapView.Marker {...markerProps} {...this.props.markerProps}>
						{this.props.onPopoverClick ? (
							<MapView.Callout>
								<View>{this.props.onPopoverClick(item)}</View>
							</MapView.Callout>
						) : null}
					</MapView.Marker>
				);
			});
		}
		return (
			<View style={{ flex: 1 }}>
				<MapView
					style={{ ...styles.map, ...this.props.style }}
					region={this.getRegion(resultsToRender)}
					customMapStyle={this.state.currentMapStyle.value}
					showsScale
					zoomEnabled
					zoomControlEnabled
				>
					{markers}
				</MapView>
			</View>
		);
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
				activeStyles.text = {
					color: 'white',
				};
			}

			const pageBtn = (
				<Button
					key={i - 1}
					onPress={() => this.setPage(i - 1)}
					light={this.state.currentPage !== i - 1}
					style={{
						paddingHorizontal: 12,
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
				backgroundColor: 'blue',
			};
			primaryStyles.text = {
				color: 'white',
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
							...{
								paddingHorizontal: 12,
							},
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

	render() {
		return this.props.onAllData
			? this.props.onAllData(
				parseHits(this.props.hits),
				parseHits(this.props.streamHits),
				this.loadMore,
				this.renderMap,
				this.renderPagination,
			) // prettier-ignore
			: this.renderMap();
	}
}

ReactiveMap.propTypes = {
	addComponent: types.funcRequired,
	setMapData: types.funcRequired,
	loadMore: types.funcRequired,
	removeComponent: types.funcRequired,
	setQueryListener: types.funcRequired,
	onQueryChange: types.func,
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
	autoCenter: types.bool,
	center: types.location,
	componentId: types.stringRequired,
	dataField: types.stringRequired,
	defaultCenter: types.location,
	defaultMapStyle: types.string,
	defaultPin: types.string,
	defaultQuery: types.func,
	defaultZoom: types.number,
	innerClass: types.style,
	innerStyle: types.style,
	innerProps: types.props,
	innerRef: types.func,
	loader: types.title,
	mapProps: types.props,
	markerProps: types.props,
	markers: types.children,
	onAllData: types.func,
	onData: types.func,
	onPageChange: types.func,
	onPopoverClick: types.func,
	pages: types.number,
	pagination: types.bool,
	react: types.react,
	showMapStyles: types.bool,
	showMarkerClusters: types.bool,
	showMarkers: types.bool,
	size: types.number,
	sortBy: types.sortBy,
	sortOptions: types.sortOptions,
	stream: types.bool,
	streamAutoCenter: types.bool,
	style: types.style,
	URLParams: types.bool,
};

ReactiveMap.defaultProps = {
	size: 10,
	style: {},
	pages: 5,
	pagination: true,
	defaultMapStyle: 'Standard',
	defaultCenter: {
		lat: 37.773972,
		lng: -122.431297,
	},
	autoCenter: false,
	streamAutoCenter: false,
	defaultZoom: 8,
	mapProps: {},
	markerProps: {},
	markers: null,
	showMapStyles: false,
	showMarkers: true,
	showMarkerClusters: true,
};

const mapStateToProps = (state, props) => ({
	mapKey: state.config.mapKey,
	hits: (state.hits[props.componentId] && state.hits[props.componentId].hits) || [],
	streamHits: state.streamHits[props.componentId] || [],
	currentPage:
		(state.selectedValues[`${props.componentId}-page`]
			&& state.selectedValues[`${props.componentId}-page`].value - 1)
		|| 0,
	time: (state.hits[props.componentId] && state.hits[props.componentId].time) || 0,
	total: state.hits[props.componentId] && state.hits[props.componentId].total,
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
	setMapData: (component, geoQuery, mustExecute) =>
		dispatch(setMapData(component, geoQuery, mustExecute)),
});

export default connect(
	mapStateToProps,
	mapDispatchtoProps,
)(ReactiveMap);
