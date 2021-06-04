import { Actions, helper } from '@appbaseio/reactivecore';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';
import VueTypes from 'vue-types';
import geohash from 'ngeohash';
import ComponentWrapper from '../basic/ComponentWrapper.jsx';
import { Checkbox } from '../../styles/FormControlList';
import Pagination from '../result/addons/Pagination.jsx';
import {
	connect,
	isFunction,
	hasCustomRenderer,
	getComponent,
	isQueryIdentical,
} from '../../utils/index';
import types from '../../utils/vueTypes';

const {
	setStreaming,
	setQueryOptions,
	updateQuery,
	loadMore,
	setValue,
	updateComponentProps,
	setDefaultQuery,
	recordResultClick,
	setMapData,
} = Actions;

const {
	isEqual,
	getQueryOptions,
	getClassName,
	parseHits,
	getOptionsFromQuery,
	getResultStats,
} = helper;

// default map center
const MAP_CENTER = {
	lat: 37.7749,
	lng: 122.4194,
};

const style = {
	width: '100%',
	height: '100vh',
	position: 'relative',
};

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

const ReactiveMap = {
	name: 'ReactiveMap',
	props: {
		className: types.string,
		componentId: types.stringRequired,
		dataField: types.stringRequired,
		react: types.react,
		size: types.number,
		sortBy: types.sortBy,
		URLParams: types.bool,
		autoCenter: types.bool,
		getMapRef: VueTypes.func.isRequired,
		center: types.location,
		defaultCenter: types.location,
		defaultPin: types.string,
		defaultZoom: VueTypes.number.def(4),
		markerProps: types.props,
		defaultQuery: types.func,
		innerClass: types.style,
		loader: types.title,
		render: types.func,
		renderItem: types.func,
		renderError: types.title,
		pages: VueTypes.number.def(5),
		currentPage: VueTypes.number.def(0),
		pagination: types.bool,
		showMarkers: types.bool,
		defaultSearchAsMove: types.bool,
		showSearchAsMove: types.bool,
		defaultRadius: types.number,
		unit: types.string,
		autoClosePopover: types.bool,
		renderMap: VueTypes.func.isRequired,
		renderPopover: VueTypes.func,
		onDragEnd: types.func,
		onZoomChanged: types.func,
		onIdle: types.func,
	},
	data() {
		const props = this.$props;
		let currentPageState = 0;
		if (props.currentPage) {
			currentPageState = Math.max(props.currentPage - 1, 0);
		}

		this.__state = {
			from: currentPageState * props.size,
			zoom: props.defaultZoom,
			searchAsMove: props.defaultSearchAsMove,
			currentPageState,
			preserveCenter: false,
			mapBoxBounds: null,
		};
		return this.__state;
	},
	computed: {
		totalPages() {
			return Math.ceil(this.total / this.$props.size) || 0;
		},
		stats() {
			const { resultsToRender } = this.getAllData();
			return {
				...getResultStats(this),
				currentPage: this.currentPageState,
				displayedResults: resultsToRender.length,
			};
		},
		hasCustomRender() {
			return hasCustomRenderer(this);
		},
	},
	watch: {
		currentPage(newVal, oldVal) {
			if (oldVal !== newVal && newVal > 0 && newVal <= this.totalPages) {
				this.setPage(newVal - 1);
			}
		},
		defaultQuery(newVal, oldVal) {
			if (!isQueryIdentical(newVal, oldVal, null, this.$props)) {
				let options = getQueryOptions(this.$props);
				options.from = 0;
				this.$defaultQuery = newVal(null, this.$props);
				const { sort, query } = this.$defaultQuery || {};

				if (sort) {
					options.sort = this.$defaultQuery.sort;
				}
				const queryOptions = getOptionsFromQuery(this.$defaultQuery);
				if (queryOptions) {
					options = { ...options, ...getOptionsFromQuery(this.$defaultQuery) };
				}
				// Update calculated default query in store
				this.setQueryOptions(this.$props.componentId, options, !query);

				const persistMapQuery = true;
				const forceExecute = true;
				// Update default query to include the geo bounding box query
				this.setDefaultQueryForRSAPI();
				this.props.setMapData(this.componentId, query, persistMapQuery, forceExecute);
				this.currentPageState = 0;
				this.from = 0;
			}
		},
		promotedResults(newVal, oldVal) {
			if (!isEqual(newVal, oldVal)) {
				this.$emit('data', this.getData());
			}
		},
		hidden(newVal, oldVal) {
			if (!isEqual(newVal, oldVal)) {
				this.$emit('data', this.getData());
			}
		},
		time(newVal, oldVal) {
			if (!isEqual(newVal, oldVal)) {
				this.$emit('data', this.getData());
			}
		},
		hits(newVal, oldVal) {
			this.$emit('data', this.getData());
			if (this.pagination) {
				// called when page is changed
				if (this.isLoading && (oldVal || newVal)) {
					this.$emit('page-change', this.currentPageState + 1, this.totalPages);
				}
			}
		},
		rawData(newVal, oldVal) {
			if (!isEqual(newVal, oldVal)) {
				this.$emit('data', this.getData());
			}
		},
		center(newVal, oldVal) {
			if (!isEqual(newVal, oldVal)) {
				const persistMapQuery = !!this.center;
				// we need to forceExecute the query because the center has changed
				const forceExecute = true;
				const geoQuery = this.getGeoQuery(this.$props);
				// Update default query for RS API
				this.setDefaultQueryForRSAPI();
				const meta = {
					mapBoxBounds: this.mapBoxBounds,
				};
				this.setMapData(this.componentId, geoQuery, persistMapQuery, forceExecute, meta);
			}
		},
	},
	methods: {
		parseLocation(location) {
			if (Array.isArray(location)) {
				return {
					lat: Number(location[0]),
					lng: Number(location[1]),
				};
			}
			return {
				lat: location ? Number(location.lat) : this.defaultCenter.lat,
				lng: location
					? Number(location.lon === undefined ? location.lng : location.lon)
					: this.defaultCenter.lng,
			};
		},
		getDefaultCenter() {
			if (this.defaultCenter) return this.parseLocation(this.defaultCenter);
			return this.parseLocation(MAP_CENTER);
		},
		addNoise(hits) {
			const hitMap = {};
			let updatedHits = [];

			hits.forEach(item => {
				const updatedItem = { ...item };
				const location = this.parseLocation(item[this.dataField]);
				const key = JSON.stringify(location);
				const count = hitMap[key] || 0;

				updatedItem[this.dataField] = count ? withDistinctLat(location, count) : location;
				updatedHits = [...updatedHits, updatedItem];

				hitMap[key] = count + 1;
			});
			return updatedHits;
		},
		getPosition(result) {
			if (result) {
				return this.parseLocation(result[this.dataField]);
			}
			return null;
		},
		getHitsCenter(hits) {
			const data = hits.map(hit => hit[this.dataField]);

			if (data.length) {
				const numCoords = data.length;

				let X = 0.0;
				let Y = 0.0;
				let Z = 0.0;

				data.forEach(location => {
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
		},
		getCenter(hits) {
			if (this.center) {
				return this.parseLocation(this.center);
			}
			const mapRef = this.getMapRef();
			if (mapRef && typeof mapRef.getCenter === 'function' && this.preserveCenter) {
				const currentCenter = mapRef.getCenter();
				setTimeout(() => {
					this.preserveCenter = false;
				}, 100);
				return this.parseLocation({
					lat: currentCenter.lat(),
					lng: currentCenter.lng(),
				});
			}

			if (hits && hits.length) {
				if (this.autoCenter) {
					return this.getHitsCenter(hits) || this.getDefaultCenter();
				}
				return hits[0] && hits[0][this.dataField]
					? this.getPosition(hits[0])
					: this.getDefaultCenter();
			}
			return this.getDefaultCenter();
		},
		handleZoomChange(zoom) {
			if (zoom) {
				if (this.searchAsMove) {
					this.zoom = zoom;
					this.preserveCenter = true;
					this.setGeoQuery(true);
				} else {
					this.zoom = zoom;
				}
				if (this.onZoomChanged) this.onZoomChanged(zoom);
			}
		},
		handleOnDragEnd() {
			if (this.searchAsMove) {
				this.preserveCenter = true;
				this.setGeoQuery(true);
			}
			if (this.onDragEnd) this.onDragEnd();
		},
		handlePreserveCenter(preserveCenter) {
			this.preserveCenter = preserveCenter;
		},
		handleOnIdle() {
			// only make the geo_bounding query if we have hits data
			if (this.hits && this.hits.length && this.searchAsMove) {
				// always execute geo-bounds query when center is set
				// to improve the specificity of search results
				const executeUpdate = !!this.center;
				this.setGeoQuery(executeUpdate);
			}
			if (this.onIdle) this.onIdle();
		},
		setGeoQuery(executeUpdate = false) {
			// execute a new query on the initial mount
			// or whenever searchAsMove is true and the map is dragged
			if (executeUpdate || (!this.skipBoundingBox && !this.mapBoxBounds)) {
				this.$defaultQuery = this.getGeoQuery();

				const persistMapQuery = !!this.center;
				const forceExecute = this.searchAsMove;
				const meta = {
					mapBoxBounds: this.mapBoxBounds,
				};
				this.setMapData(
					this.componentId,
					this.$defaultQuery,
					persistMapQuery,
					forceExecute,
					meta,
				);
			}
			this.skipBoundingBox = false;
		},
		getMapParams() {
			const { data } = this.getData();
			const {
				showMarkers,
				defaultPin,
				renderPopover,
				autoClosePopover,
				markerProps,
				renderItem,
			} = this;
			return {
				resultsToRender: data,
				center: this.getCenter(data),
				getPosition: this.getPosition,
				zoom: this.zoom,
				renderItem,
				showMarkers,
				defaultPin,
				renderPopover,
				autoClosePopover,
				renderSearchAsMove: this.renderSearchAsMove,
				markerProps,
				handlePreserveCenter: this.handlePreserveCenter,
				preserveCenter: this.preserveCenter,
				handleOnDragEnd: this.handleOnDragEnd,
				handleOnIdle: this.handleOnIdle,
				handleZoomChange: this.handleZoomChange,
			};
		},
		getAllData() {
			const { size, promotedResults, customData, currentPage, hits } = this;
			const results = parseHits(hits) || [];
			const parsedPromotedResults = parseHits(promotedResults) || [];
			let filteredResults = results;
			const base = currentPage * size;

			if (parsedPromotedResults.length) {
				const ids = parsedPromotedResults.map(item => item._id).filter(Boolean);
				if (ids) {
					filteredResults = filteredResults.filter(item => !ids.includes(item._id));
				}

				filteredResults = [...parsedPromotedResults, ...filteredResults];
			}

			filteredResults = filteredResults
				.filter(item => !!item[this.dataField])
				.map(item => ({
					...item,
					[this.dataField]: getLocationObject(item[this.dataField]),
				}));

			const resultsToRender = this.addNoise(filteredResults);

			return {
				results,
				resultsToRender,
				customData: customData || {},
				promotedResults: parsedPromotedResults,
				loadMore: this.loadMore,
				base,
				triggerClickAnalytics: this.triggerClickAnalytics,
			};
		},
		getData() {
			const {
				promotedResults,
				aggregationData,
				customData,
				resultsToRender,
			} = this.getAllData();
			return {
				data: this.withClickIds(resultsToRender),
				aggregationData: this.withClickIds(aggregationData || []),
				promotedData: this.withClickIds(promotedResults),
				rawData: this.rawData,
				resultStats: this.stats,
				customData,
			};
		},
		getComponent() {
			const { error, isLoading } = this;
			const data = {
				error,
				loading: isLoading,
				loadMore: this.loadMore,
				triggerClickAnalytics: this.triggerClickAnalytics,
				setPage: this.setPage,
				...this.getData(),
			};
			return getComponent(data, this);
		},
		setPage(page) {
			// pageClick will be called every time a pagination button is clicked
			if (page !== this.currentPageState) {
				this.$emit('pageClick', page + 1);
				this.$emit('page-click', page + 1);
				const value = this.size * page;
				const options = getQueryOptions(this.$props);
				options.from = this.$data.from;
				this.from = value;
				this.currentPageState = page;
				this.loadMoreAction(
					this.componentId,
					{
						...options,
						from: value,
					},
					false,
				);
				if (this.URLParams) {
					this.setPageURL(this.componentId, page + 1, this.componentId, false, true);
				}
			}
		},
		setDefaultQueryForRSAPI() {
			if (this.defaultQuery && typeof this.defaultQuery === 'function') {
				let defaultQuery = this.defaultQuery();
				if (this.mapBoxBounds) {
					const geoQuery = {
						geo_bounding_box: {
							[this.dataField]: this.mapBoxBounds,
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
				this.setDefaultQuery(this.componentId, defaultQuery);
			}
		},
		getArrPosition(location) {
			return { lat: location.lat, lon: location.lon || location.lng };
		},
		getGeoQuery(props = this.$props) {
			this.$defaultQuery = props.defaultQuery ? props.defaultQuery() : null;
			const mapRef = this.getMapRef();
			const mapBounds
				= mapRef && typeof mapRef.getBounds === 'function'
					? mapRef.getBounds()
					: false;
			let north;
			let south;
			let east;
			let west;

			if (mapBounds) {
				north = mapBounds.getNorthEast().lat();
				south = mapBounds.getSouthWest().lat();
				east = mapBounds.getNorthEast().lng();
				west = mapBounds.getSouthWest().lng();

				const boundingBoxCoordinates = {
					top_left: [west, north],
					bottom_right: [east, south],
				};
				this.mapBoxBounds = boundingBoxCoordinates;

				const geoQuery = {
					geo_bounding_box: {
						[this.dataField]: boundingBoxCoordinates,
					},
				};

				if (this.$defaultQuery) {
					const { query } = this.$defaultQuery;

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
			return this.$defaultQuery ? this.$defaultQuery.query : null;
		},
		getGeoDistanceQuery() {
			const center = this.center || this.defaultCenter;
			if (center && this.defaultRadius) {
				// skips geo bounding box query on initial load
				this.skipBoundingBox = true;
				return {
					geo_distance: {
						distance: `${this.defaultRadius}${this.unit}`,
						[this.dataField]: this.getArrPosition(center),
					},
				};
			}
			return null;
		},
		loadMore() {
			if (this.hits && !this.pagination && this.total !== this.hits.length) {
				const value = this.from + this.size;
				const options = getQueryOptions(this.$props);
				this.from = value;
				this.loadMoreAction(
					this.componentId,
					{
						...options,
						from: value,
					},
					true,
				);
			}
		},
		triggerClickAnalytics(searchPosition, documentId) {
			let docId = documentId;
			if (!docId) {
				const { data } = this.getData();
				const hitData = data.find(hit => hit._click_id === searchPosition);
				if (hitData && hitData._id) {
					docId = hitData._id;
				}
			}
			this.recordResultClick(searchPosition, docId);
		},
		withClickIds(results) {
			const { base } = this.getAllData();
			return results.map((result, index) => ({
				...result,
				_click_id: base + index,
			}));
		},
		toggleSearchAsMove() {
			this.searchAsMove = !this.searchAsMove;
		},
		renderErrorComponent() {
			const renderError = this.$scopedSlots.renderError || this.$props.renderError;
			if (renderError && this.error && !this.isLoading) {
				return isFunction(renderError) ? renderError(this.error) : renderError;
			}
			return null;
		},
		renderSearchAsMove() {
			if (this.showSearchAsMove) {
				return (
					<div
						style={{
							position: 'absolute',
							bottom: '30px',
							left: '10px',
							width: '240px',
							backgroundColor: '#fff',
							padding: '8px 10px',
							boxShadow: 'rgba(0,0,0,0.3) 0px 1px 4px -1px',
							borderRadius: 2,
							zIndex: 10000,
						}}
						className={getClassName(this.innerClass, 'checkboxContainer') || null}
					>
						<Checkbox
							type="checkbox"
							class={getClassName(this.$props.innerClass, 'checkbox')}
							id={`${this.$props.componentId}-searchasmove`}
							onClick={this.toggleSearchAsMove}
							checked={this.searchAsMove}
							show
						/>

						<label
							className={getClassName(this.innerClass, 'label') || null}
							for={`${this.$props.componentId}-searchasmove`}
						>
							Search as I move the map
						</label>
					</div>
				);
			}

			return null;
		},
		renderPagination() {
			return (
				<Pagination
					pages={this.pages}
					totalPages={this.totalPages}
					currentPage={this.currentPageState}
					setPage={this.setPage}
					innerClass={this.innerClass}
				/>
			);
		},
	},
	created() {
		if (this.defaultPage >= 0) {
			this.currentPageState = this.defaultPage;
			this.from = this.currentPageState * this.$props.size;
		}
		this.internalComponent = `${this.$props.componentId}__internal`;
		this.updateComponentProps(
			this.componentId,
			{ from: this.from },
			componentTypes.reactiveMap,
		);
		this.updateComponentProps(
			this.internalComponent,
			{ from: this.from },
			componentTypes.reactiveMap,
		);
	},
	mounted() {
		if (this.defaultPage < 0 && this.currentPage > 0) {
			if (this.$props.URLParams) {
				this.setPageURL(
					this.$props.componentId,
					this.currentPage,
					this.$props.componentId,
					false,
					true,
				);
			}
		}
		let options = getQueryOptions(this.$props);
		options.from = this.$data.from;
		if (this.$props.sortBy) {
			options.sort = [
				{
					[this.$props.dataField]: {
						order: this.$props.sortBy,
					},
				},
			];
		}
		this.$defaultQuery = null;
		if (this.$props.defaultQuery) {
			this.$defaultQuery = this.$props.defaultQuery();
			options = { ...options, ...getOptionsFromQuery(this.$defaultQuery) };

			// Override sort query with defaultQuery's sort if defined
			if (this.$defaultQuery.sort) {
				options.sort = this.$defaultQuery.sort;
			}
			// since we want defaultQuery to be executed anytime
			// map component's query is being executed
			const persistMapQuery = true;
			// no need to forceExecute because setReact() will capture the main query
			// and execute the defaultQuery along with it
			const forceExecute = false;

			// Update default query for RS API
			this.setDefaultQueryForRSAPI();

			this.setMapData(
				this.componentId,
				this.$defaultQuery.query,
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
				const persistMapQuery = !!this.center;

				// - forceExecute will make sure that the component query + Map query gets executed
				//   irrespective of the changes in the component query
				// - forceExecute will only come into play when searchAsMove is true
				// - kindly note that forceExecute may result in one additional network request
				//   since it bypasses the gatekeeping
				const forceExecute = this.searchAsMove;
				// Set meta for `distance` and `coordinates` in selected value
				const center = this.center || this.defaultCenter;
				const coordinatesObject = this.getArrPosition(center);
				const meta = {
					distance: this.defaultRadius,
					coordinates: `${coordinatesObject.lat}, ${coordinatesObject.lon}`,
				};
				this.setMapData(this.componentId, query, persistMapQuery, forceExecute, meta);
			}
		}
		this.setQueryOptions(
			this.componentId,
			options,
			!(this.$defaultQuery && this.$defaultQuery.query),
		);
	},
	render() {
		const loader = this.$scopedSlots.loader || this.$props.loader;
		return (
			<div style={{ ...style, ...this.$props.style }} class={this.$props.className}>
				{this.renderErrorComponent()}
				{this.isLoading && loader}
				{!(this.isLoading && loader) && this.hasCustomRender ? this.getComponent() : null}
				{this.renderMap(this.getMapParams())}
				{this.pagination ? this.renderPagination() : null}
			</div>
		);
	},
};
const mapStateToProps = (state, props) => ({
	defaultPage:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].value - 1)
		|| -1,
	error: state.error[props.componentId],
	isLoading: state.isLoading[props.componentId],
	hits: state.hits[props.componentId] && state.hits[props.componentId].hits,
	promotedResults: state.promotedResults[props.componentId],
	customData: state.customData[props.componentId],
	total: state.hits[props.componentId] && state.hits[props.componentId].total,
	time: state.hits[props.componentId] && state.hits[props.componentId].time,
	rawData: state.rawData[props.componentId],
	hidden: state.hits[props.componentId] && state.hits[props.componentId].hidden,
});
const mapDispatchToProps = {
	loadMoreAction: loadMore,
	setPageURL: setValue,
	setQueryOptions,
	setStreaming,
	updateQuery,
	updateComponentProps,
	setDefaultQuery,
	recordResultClick,
	setMapData,
};

export const RMConnected = ComponentWrapper(
	connect(mapStateToProps, mapDispatchToProps)(ReactiveMap),
	{
		componentType: componentTypes.reactiveMap,
		internalComponent: true,
	},
);

ReactiveMap.install = function(Vue) {
	Vue.component(ReactiveMap.name, RMConnected);
};
// Add componentType for SSR
ReactiveMap.componentType = componentTypes.reactiveMap;

export default ReactiveMap;
