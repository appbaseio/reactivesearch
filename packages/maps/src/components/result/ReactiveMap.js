import React, { Component } from 'react';
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
	setDefaultQuery,
	setComponentProps,
	updateComponentProps,
	recordResultClick,
} from '@appbaseio/reactivecore/lib/actions';
import {
	isEqual,
	getQueryOptions,
	pushToAndClause,
	parseHits,
	getClassName,
	getResultStats,
	checkSomePropChange,
} from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';
import { connect, isFunction, ReactReduxContext, getValidPropsKeys } from '@appbaseio/reactivesearch/lib/utils';
import Pagination from '@appbaseio/reactivesearch/lib/components/result/addons/Pagination';
import { Checkbox } from '@appbaseio/reactivesearch/lib/styles/FormControlList';
import geohash from 'ngeohash';

const Standard = require('./addons/styles/Standard');
const BlueEssence = require('./addons/styles/BlueEssence');
const BlueWater = require('./addons/styles/BlueWater');
const FlatMap = require('./addons/styles/FlatMap');
const LightMonochrome = require('./addons/styles/LightMonochrome');
const MidnightCommander = require('./addons/styles/MidnightCommander');
const UnsaturatedBrowns = require('./addons/styles/UnsaturatedBrowns');

const MAP_CENTER = {
	lat: 37.7749,
	lng: 122.4194,
};

export const MAP_SERVICES = {
	GOOGLE_MAP: 'GOOGLE_MAP',
	OPEN_STREET_MAP: 'OPEN_STREET_MAP',
};

function getLocationObject(location) {
	const resultType = Array.isArray(location) ? 'array' : typeof location;
	switch (resultType) {
		case 'string': {
			if (location.indexOf(',') > -1) {
				const locationSplit = location.split(',');
				return {
					lat: parseFloat(locationSplit[0]),
					lng: parseFloat(locationSplit[1]),
				};
			}
			const locationDecode = geohash.decode(location);
			return {
				lat: locationDecode.latitude,
				lng: locationDecode.longitude,
			};
		}
		case 'array': {
			return {
				lat: location[1],
				lng: location[0],
			};
		}
		default: {
			return location;
		}
	}
}

function getPrecision(a) {
	if (isNaN(a)) return 0; // eslint-disable-line
	let e = 1;
	let p = 0;
	while (Math.round(a * e) / e !== a) {
		e *= 10;
		p += 1;
	}
	return p;
}

function withDistinctLat(loc, count) {
	const length = getPrecision(loc.lat);
	const noiseFactor = length >= 6 ? 4 : length - 2;
	// eslint-disable-next-line
	const suffix = (1 / 10 ** noiseFactor) * count;
	const location = {
		...loc,
		lat: parseFloat((loc.lat + suffix).toFixed(length)),
	};
	return location;
}

class ReactiveMap extends Component {
	static contextType = ReactReduxContext;

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
			totalPages: 0,
			currentPage: props.currentPage,
			mapBoxBounds: null,
			searchAsMove: props.searchAsMove,
			zoom: props.defaultZoom,
			preserveCenter: false,
		};

		this.internalComponent = `${props.componentId}__internal`;
		props.setQueryListener(props.componentId, props.onQueryChange, props.onError);
		// Update props in store
		props.setComponentProps(props.componentId, props, componentTypes.reactiveMap);
		props.setComponentProps(this.internalComponent, props, componentTypes.reactiveMap);
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

			// since we want defaultQuery to be executed anytime
			// map component's query is being executed
			const persistMapQuery = true;
			// no need to forceExecute because setReact() will capture the main query
			// and execute the defaultQuery along with it
			const forceExecute = false;

			// Update default query for RS API
			this.setDefaultQueryForRSAPI();

			this.props.setMapData(
				this.props.componentId,
				this.defaultQuery.query,
				persistMapQuery,
				forceExecute,
			);
		} else {
			// only apply geo-distance when defaultQuery prop is not set
			const query = this.getGeoDistanceQuery();
			if (query) {
				// - only persist the map query if center prop is set
				// - ideally, persist the map query if you want to keep executing it
				//   whenever there is a change (due to subscription) in the component query
				const persistMapQuery = !!this.props.center;

				// - forceExecute will make sure that the component query + Map query gets executed
				//   irrespective of the changes in the component query
				// - forceExecute will only come into play when searchAsMove is true
				// - kindly note that forceExecute may result in one additional network request
				//   since it bypasses the gatekeeping
				const forceExecute = this.state.searchAsMove;
				// Set meta for `distance` and `coordinates` in selected value
				const center = this.props.center || this.props.defaultCenter;
				const coordinatesObject = this.getArrPosition(center);
				const meta = {
					distance: this.props.defaultRadius,
					coordinates: `${coordinatesObject.lat}, ${coordinatesObject.lon}`,
				};
				this.props.setMapData(this.props.componentId, query, persistMapQuery, forceExecute, meta);
			}
		}

		this.props.setQueryOptions(
			this.props.componentId,
			options,
			!(this.defaultQuery && this.defaultQuery.query),
		);
		this.setReact(this.props);
	}

	componentDidUpdate(prevProps) {
		checkSomePropChange(this.props, prevProps, getValidPropsKeys(this.props), () => {
			this.props.updateComponentProps(
				this.props.componentId,
				this.props,
				componentTypes.reactiveMap,
			);
			this.props.updateComponentProps(
				this.internalComponent,
				this.props,
				componentTypes.reactiveMap,
			);
		});

		const updatedState = {};
		if (
			this.props.sortBy !== prevProps.sortBy
			|| this.props.size !== prevProps.size
			|| !isEqual(this.props.dataField, prevProps.dataField)
		) {
			const options = getQueryOptions(this.props);
			options.from = 0;
			if (this.props.sortBy) {
				options.sort = [
					{
						[this.props.dataField]: {
							order: this.props.sortBy,
						},
					},
				];
			}

			updatedState.from = 0;
			updatedState.currentPage = 0;
			this.props.setQueryOptions(this.props.componentId, options, true);
		}

		if (this.props.onData) {
			checkSomePropChange(
				this.props,
				prevProps,
				[
					'hits',
					'promotedResults',
					'customData',
					'total',
					'size',
					'time',
					'hidden',
					'streamHits',
				],
				() => {
					this.props.onData(this.getData());
				},
			);
		}

		if (!isEqual(this.props.center, prevProps.center)) {
			const persistMapQuery = !!this.props.center;
			// we need to forceExecute the query because the center has changed
			const forceExecute = true;
			const geoQuery = this.getGeoQuery(this.props);
			// Update default query for RS API
			this.setDefaultQueryForRSAPI();
			const meta = {
				mapBoxBounds: this.state.mapBoxBounds,
			};
			this.props.setMapData(
				this.props.componentId,
				geoQuery,
				persistMapQuery,
				forceExecute,
				meta,
			);
		}

		if (prevProps.defaultQuery && !isEqual(prevProps.defaultQuery(), this.defaultQuery)) {
			const options = getQueryOptions(prevProps);
			options.from = this.state.from;
			this.defaultQuery = this.props.defaultQuery();

			const { sort, query } = this.defaultQuery;

			if (sort) {
				options.sort = this.defaultQuery.sort;
				this.props.setQueryOptions(this.props.componentId, options, !query);
			}

			const persistMapQuery = true;
			const forceExecute = true;
			// Update default query to include the geo bounding box query
			this.setDefaultQueryForRSAPI();
			this.props.setMapData(this.props.componentId, query, persistMapQuery, forceExecute);
		}

		if (this.props.stream !== prevProps.stream) {
			this.props.setStreaming(this.props.componentId, this.props.stream);
		}

		if (!isEqual(prevProps.react, this.props.react)) {
			this.setReact(this.props);
		}

		// called when page is changed
		if (this.props.pagination && this.props.isLoading) {
			if (this.props.onPageChange) {
				this.props.onPageChange();
			}
		}

		if (
			!this.props.pagination
			&& this.props.hits
			&& prevProps.hits
			&& this.props.hits.length < prevProps.hits.length
		) {
			if (this.props.onPageChange) {
				this.props.onPageChange();
			}
			updatedState.from = 0;
		}

		if (this.props.pagination && this.props.total !== prevProps.total) {
			updatedState.totalPages = Math.ceil(this.props.total / this.props.size);
			updatedState.currentPage = prevProps.total ? 0 : this.state.currentPage;
		}

		if (this.props.searchAsMove !== prevProps.searchAsMove) {
			updatedState.searchAsMove = this.props.searchAsMove;
		}

		if (
			this.props.defaultZoom !== prevProps.defaultZoom
			&& !isNaN(this.props.defaultZoom) && // eslint-disable-line
			this.props.defaultZoom
		) {
			updatedState.zoom = this.props.defaultZoom;
		}

		if (this.props.defaultMapStyle !== prevProps.defaultMapStyle) {
			updatedState.currentMapStyle
				= this.mapStyles.find(style => style.label === this.props.defaultMapStyle)
				|| this.mapStyles[0];
		}

		this.updateState(updatedState);
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (
			this.props.showSearchAsMove !== nextProps.showSearchAsMove
			|| this.state.searchAsMove !== nextState.searchAsMove
			|| this.props.showMapStyles !== nextProps.showMapStyles
			|| this.props.autoCenter !== nextProps.autoCenter
			|| this.props.isLoading !== nextProps.isLoading
			|| this.props.error !== nextProps.error
			|| this.props.streamAutoCenter !== nextProps.streamAutoCenter
			|| this.props.defaultZoom !== nextProps.defaultZoom
			|| this.props.showMarkerClusters !== nextProps.showMarkerClusters
			|| !isEqual(this.state.currentMapStyle, nextState.currentMapStyle)
			|| this.props.updaterKey !== nextProps.updaterKey
		) {
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

	updateState = (newState) => {
		this.setState({
			...newState,
		});
	};

	getAllData = () => {
		const {
			size, promotedResults, customData,
		} = this.props;
		const { currentPage } = this.state;
		const results = parseHits(this.props.hits) || [];
		const streamResults = parseHits(this.props.streamHits) || [];
		const parsedPromotedResults = parseHits(promotedResults) || [];
		let filteredResults = results;
		const base = currentPage * size;
		if (streamResults.length) {
			const ids = streamResults.map(item => item._id);
			filteredResults = filteredResults.filter(item => !ids.includes(item._id));
		}

		if (parsedPromotedResults.length) {
			const ids = parsedPromotedResults.map(item => item._id).filter(Boolean);
			if (ids) {
				filteredResults = filteredResults.filter(item => !ids.includes(item._id));
			}

			filteredResults = [...streamResults, ...parsedPromotedResults, ...filteredResults];
		}
		return {
			results,
			streamResults,
			filteredResults,
			promotedResults: parsedPromotedResults,
			customData: customData || {},
			loadMore: this.loadMore,
			base,
			triggerClickAnalytics: this.triggerAnalytics,
		};
	};

	getData = () => {
		const {
			streamResults,
			filteredResults,
			promotedResults,
			customData,
		} = this.getAllData();
		return {
			data: this.withClickIds(filteredResults),
			streamData: this.withClickIds(streamResults),
			promotedData: this.withClickIds(promotedResults),
			customData,
			rawData: this.props.rawData,
			resultStats: getResultStats(this.props),
		};
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

	setDefaultQueryForRSAPI = () => {
		if (this.props.defaultQuery && typeof this.props.defaultQuery === 'function') {
			let defaultQuery = this.props.defaultQuery();
			if (this.state.mapBoxBounds) {
				const geoQuery = {
					geo_bounding_box: {
						[this.props.dataField]: this.state.mapBoxBounds,
					},
				};
				const { query, ...options } = defaultQuery;

				if (query) {
					// adds defaultQuery's query to geo-query
					// to generate a map query
					defaultQuery = {
						query: {
							must: [geoQuery, query],
						},
						...options,
					};
				}
			}
			this.props.setDefaultQuery(this.props.componentId, defaultQuery);
		}
	}

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

					const locationObj = getLocationObject(location);
					lat = (locationObj.lat * Math.PI) / 180;
					lng
						= ((locationObj.lng !== undefined ? locationObj.lng : locationObj.lon)
							* Math.PI)
						/ 180;

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
			// eslint-disable-next-line
			const hyp = Math.sqrt(X * X + Y * Y);
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

	// getArrPosition = location => [location.lat, location.lon || location.lng];
	getArrPosition = location => ({ lat: location.lat, lon: location.lon || location.lng });

	getGeoDistanceQuery = () => {
		const center = this.props.center || this.props.defaultCenter;
		if (center && this.props.defaultRadius) {
			// skips geo bounding box query on initial load
			this.skipBoundingBox = true;
			return {
				geo_distance: {
					distance: `${this.props.defaultRadius}${this.props.unit}`,
					[this.props.dataField]: this.getArrPosition(center),
				},
			};
		}
		return null;
	};

	getGeoQuery = (props = this.props) => {
		this.defaultQuery = props.defaultQuery ? props.defaultQuery() : null;

		const mapBounds = this.props.mapRef && typeof this.props.mapRef.getBounds === 'function' ? this.props.mapRef.getBounds() : false;

		let north;
		let south;
		let east;
		let west;

		if (mapBounds) {
			switch (this.props.mapService) {
				case MAP_SERVICES.GOOGLE_MAP:
					north = mapBounds.getNorthEast().lat();
					south = mapBounds.getSouthWest().lat();
					east = mapBounds.getNorthEast().lng();
					west = mapBounds.getSouthWest().lng();
					break;
				case MAP_SERVICES.OPEN_STREET_MAP:
					north = mapBounds._northEast.lat;
					south = mapBounds._southWest.lat;
					east = mapBounds._northEast.lng;
					west = mapBounds._southWest.lng;
					break;
				default:
					north = null;
					south = null;
					east = null;
					west = null;
			}

			const boundingBoxCoordinates = {
				top_left: [west, north],
				bottom_right: [east, south],
			};

			this.setState({
				mapBoxBounds: boundingBoxCoordinates,
			});

			const geoQuery = {
				geo_bounding_box: {
					[this.props.dataField]: boundingBoxCoordinates,
				},
			};

			if (this.defaultQuery) {
				const { query } = this.defaultQuery;

				if (query) {
					// adds defaultQuery's query to geo-query
					// to generate a map query

					return {
						must: [geoQuery, query],
					};
				}
			}

			return geoQuery;
		}

		// return the defaultQuery (if set) or null when map query not available
		return this.defaultQuery ? this.defaultQuery.query : null;
	};

	setGeoQuery = (executeUpdate = false) => {
		// execute a new query on the initial mount
		// or whenever searchAsMove is true and the map is dragged
		if (executeUpdate || (!this.skipBoundingBox && !this.state.mapBoxBounds)) {
			this.defaultQuery = this.getGeoQuery();

			const persistMapQuery = !!this.props.center;
			const forceExecute = this.state.searchAsMove;
			const meta = {
				mapBoxBounds: this.state.mapBoxBounds,
			};
			this.props.setMapData(
				this.props.componentId,
				this.defaultQuery,
				persistMapQuery,
				forceExecute,
				meta,
			);
		}
		this.skipBoundingBox = false;
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
			});
			this.props.loadMore(
				this.props.componentId,
				{
					...options,
					from: value,
				},
				true,
			);
		}
	};

	setPage = (page) => {
		const value = this.props.size * page;
		const options = getQueryOptions(this.props);
		options.from = this.state.from;
		this.setState({
			from: value,
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

	getCenter = (hits) => {
		if (this.props.center) {
			return this.parseLocation(this.props.center);
		}

		if (
			(this.props.mapRef && typeof this.props.mapRef.getCenter === 'function' && this.state.preserveCenter)
			|| (this.props.stream && this.props.streamHits.length && !this.props.streamAutoCenter)
		) {
			const currentCenter = this.props.mapRef.getCenter();
			setTimeout(() => {
				this.setState({
					preserveCenter: false,
				});
			}, 100);
			if (this.props.mapService === MAP_SERVICES.GOOGLE_MAP) {
				return this.parseLocation({
					lat: currentCenter.lat(),
					lng: currentCenter.lng(),
				});
			}

			return this.parseLocation({
				lat: currentCenter.lat,
				lng: currentCenter.lng,
			});
		}

		if (hits && hits.length) {
			if (this.props.autoCenter || this.props.streamAutoCenter) {
				return this.getHitsCenter(hits) || this.getDefaultCenter();
			}
			return hits[0] && hits[0][this.props.dataField]
				? this.getPosition(hits[0])
				: this.getDefaultCenter();
		}
		return this.getDefaultCenter();
	};

	getDefaultCenter = () => {
		if (this.props.defaultCenter) return this.parseLocation(this.props.defaultCenter);
		return this.parseLocation(MAP_CENTER);
	};

	toggleSearchAsMove = () => {
		this.setState({
			searchAsMove: !this.state.searchAsMove,
		});
	};

	renderError = () => {
		const { error, renderError } = this.props;
		const { isLoading } = this.props;
		if (renderError && error && !isLoading) {
			return isFunction(renderError) ? renderError(error) : renderError;
		}
		return null;
	};

	renderSearchAsMove = () => {
		if (this.props.showSearchAsMove) {
			return (
				<div
					style={{
						position: 'absolute',
						bottom: 30,
						left: 10,
						width: 240,
						backgroundColor: '#fff',
						padding: '8px 10px',
						boxShadow: 'rgba(0,0,0,0.3) 0px 1px 4px -1px',
						borderRadius: 2,
						zIndex: 10000,
					}}
					className={getClassName(this.props.innerClass, 'checkboxContainer') || null}
				>
					<Checkbox
						className={getClassName(this.props.innerClass, 'checkbox') || null}
						id="searchasmove"
						onChange={this.toggleSearchAsMove}
						checked={this.state.searchAsMove}
					/>
					<label
						className={getClassName(this.props.innerClass, 'label') || null}
						htmlFor="searchasmove"
					>
						Search as I move the map
					</label>
				</div>
			);
		}

		return null;
	};

	addNoise = (hits) => {
		const hitMap = {};
		let updatedHits = [];

		hits.forEach((item) => {
			const updatedItem = { ...item };
			const location = this.parseLocation(item[this.props.dataField]);
			const key = JSON.stringify(location);
			const count = hitMap[key] || 0;

			updatedItem[this.props.dataField] = count ? withDistinctLat(location, count) : location;
			updatedHits = [...updatedHits, updatedItem];

			hitMap[key] = count + 1;
		});
		return updatedHits;
	};

	renderPagination = () => (
		<Pagination
			pages={this.props.pages}
			totalPages={this.state.totalPages}
			currentPage={this.state.currentPage}
			setPage={this.setPage}
			innerClass={this.props.innerClass}
		/>
	);

	getResultsToRender = () => {
		const results = parseHits(this.props.hits) || [];
		const streamResults = parseHits(this.props.streamHits) || [];
		let filteredResults = results.filter(item => !!item[this.props.dataField]);

		if (streamResults.length) {
			const ids = streamResults.map(item => item._id);
			filteredResults = filteredResults.filter(item => !ids.includes(item._id));
		}

		filteredResults = [...streamResults, ...filteredResults].map(item => ({
			...item,
			[this.props.dataField]: getLocationObject(item[this.props.dataField]),
		}));

		const resultsToRender = this.addNoise(filteredResults);
		return resultsToRender;
	};

	handlePreserveCenter = (preserveCenter) => {
		this.setState({
			preserveCenter,
		});
	};

	handleOnIdle = () => {
		// only make the geo_bounding query if we have hits data
		if (this.props.hits.length && this.state.searchAsMove) {
			// always execute geo-bounds query when center is set
			// to improve the specificity of search results
			const executeUpdate = !!this.props.center;
			this.setGeoQuery(executeUpdate);
		}
		if (this.props.mapProps.onIdle) this.props.mapProps.onIdle();
	};

	handleOnDragEnd = () => {
		if (this.state.searchAsMove) {
			this.setState(
				{
					preserveCenter: true,
				},
				() => {
					this.setGeoQuery(true);
				},
			);
		}
		if (this.props.mapProps.onDragEnd) this.props.mapProps.onDragEnd();
	};

	handleZoomChange = () => {
		const zoom = (this.props.mapRef && typeof this.props.mapRef.getZoom === 'function' ? this.props.mapRef.getZoom() : false);
		if (zoom) {
			if (this.state.searchAsMove) {
				this.setState(
					{
						zoom,
						preserveCenter: true,
					},
					() => {
						this.setGeoQuery(true);
					},
				);
			} else {
				this.setState({
					zoom,
				});
			}
			if (this.props.mapProps.onZoomChanged) this.props.mapProps.onZoomChanged();
		}
	};

	get shouldRenderLoader() {
		return this.props.loader && this.props.isLoading;
	}

	triggerAnalytics = (searchPosition, documentId) => {
		// click analytics would only work client side and after javascript loads
		let docId = documentId;
		if (!docId) {
			const { data } = this.getData();
			const hitData = data.find(hit => hit._click_id === searchPosition);
			if (hitData && hitData._id) {
				docId = hitData._id;
			}
		}
		this.props.triggerAnalytics(searchPosition, docId);
	};

	withClickIds = (hits) => {
		const { currentPage, size } = this.props;
		const base = currentPage * size;

		return hits.map((hit, index) => ({
			...hit,
			_click_id: base + index + 1,
		}));
	};

	get mapParams() {
		const resultsToRender = this.getResultsToRender();
		const {
			showMarkers,
			renderData,
			defaultPin,
			onPopoverClick,
			autoClosePopover,
			markerProps,
			innerRef,
		} = this.props;
		return {
			resultsToRender,
			center: this.getCenter(resultsToRender),
			getPosition: this.getPosition,
			zoom: this.state.zoom,
			showMarkers,
			renderData,
			defaultPin,
			onPopoverClick,
			autoClosePopover,
			renderSearchAsMove: this.renderSearchAsMove,
			markerProps,
			innerRef,
			handlePreserveCenter: this.handlePreserveCenter,
			preserveCenter: this.state.preserveCenter,
			handleOnDragEnd: this.handleOnDragEnd,
			handleOnIdle: this.handleOnIdle,
			handleZoomChange: this.handleZoomChange,
		};
	}

	render() {
		const style = {
			width: '100%',
			height: '100vh',
			position: 'relative',
		};

		return (
			<div style={{ ...style, ...this.props.style }} className={this.props.className}>
				{this.renderError()}
				{this.shouldRenderLoader ? this.props.loader : null}
				{!this.shouldRenderLoader
					&& (this.props.renderAllData
						? this.props.renderAllData(
							this.withClickIds(parseHits(this.props.hits)),
							this.withClickIds(parseHits(this.props.streamHits)),
							this.loadMore,
							() => this.props.renderMap(this.mapParams),
							this.renderPagination,
							this.triggerAnalytics,
							this.getData(),
						) // prettier-ignore
						: this.props.renderMap(this.mapParams))}
			</div>
		);
	}
}

ReactiveMap.propTypes = {
	addComponent: types.funcRequired,
	setMapData: types.funcRequired,
	loadMore: types.funcRequired,
	removeComponent: types.funcRequired,
	setQueryListener: types.funcRequired,
	setDefaultQuery: types.funcRequired,
	setComponentProps: types.funcRequired,
	updateComponentProps: types.funcRequired,
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
	config: types.props,
	analytics: types.props,
	headers: types.headers,
	mapService: types.stringRequired,
	promotedResults: types.hits,
	customData: types.title,
	hidden: types.number,
	rawData: types.rawData,
	triggerAnalytics: types.funcRequired,
	// component props
	autoCenter: types.bool,
	center: types.location,
	className: types.string,
	componentId: types.stringRequired,
	dataField: types.stringRequired,
	defaultCenter: types.location,
	defaultMapStyle: types.string,
	defaultPin: types.string,
	defaultQuery: types.func,
	defaultZoom: types.number,
	error: types.title,
	innerClass: types.style,
	innerRef: types.func,
	loader: types.title,
	mapProps: types.props,
	markerProps: types.props,
	markers: types.children,
	renderAllData: types.func,
	renderData: types.func,
	renderError: types.title,
	onPageChange: types.func,
	onError: types.func,
	onData: types.func,
	onPopoverClick: types.func,
	pages: types.number,
	pagination: types.bool,
	react: types.react,
	searchAsMove: types.bool,
	showMapStyles: types.bool,
	showMarkerClusters: types.bool,
	showMarkers: types.bool,
	showSearchAsMove: types.bool,
	size: types.number,
	sortBy: types.sortBy,
	stream: types.bool,
	streamAutoCenter: types.bool,
	style: types.style,
	URLParams: types.bool,
	defaultRadius: types.number,
	unit: types.string,
	autoClosePopover: types.bool,
	renderMap: types.func,
	updaterKey: types.number,
	mapRef: types.any, // eslint-disable-line
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
	error: state.error[props.componentId],
	isLoading: state.isLoading[props.componentId] || false,
	total: state.hits[props.componentId] && state.hits[props.componentId].total,
	config: state.config,
	headers: state.appbaseRef.headers,
	analytics: state.analytics,
	rawData: state.rawData[props.componentId],
	promotedResults: state.promotedResults[props.componentId] || [],
	customData: state.customData[props.componentId],
	hidden: state.hits[props.componentId] && state.hits[props.componentId].hidden,
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
	setMapData: (component, geoQuery, persistMapQuery, forceExecute = false, meta = {}) =>
		dispatch(setMapData(component, geoQuery, persistMapQuery, forceExecute, meta)),
	setDefaultQuery: (component, query) => dispatch(setDefaultQuery(component, query)),
	setComponentProps: (component, options, componentType) =>
		dispatch(setComponentProps(component, options, componentType)),
	updateComponentProps: (component, options) =>
		dispatch(updateComponentProps(component, options)),
	triggerAnalytics: (searchPosition, docId) => dispatch(recordResultClick(searchPosition, docId)),
});

export default connect(
	mapStateToProps,
	mapDispatchtoProps,
)(ReactiveMap);
