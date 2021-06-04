import * as GmapMapFull from 'gmap-vue';
import Map from 'gmap-vue/dist/components-implementation/map';
import VueTypes from 'vue-types';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';
import { RMConnected } from './ReactiveMap.jsx';
import GoogleMapMarkers from './GoogleMapMarkers.jsx';
import types from '../../utils/vueTypes';

const ReactiveGoogleMap = {
	name: 'ReactiveGoogleMap',
	props: {
		className: types.string,
		componentId: types.stringRequired,
		dataField: types.stringRequired,
		defaultZoom: VueTypes.number.def(4),
		react: types.react,
		size: types.number,
		sortBy: types.sortBy,
		URLParams: types.bool,
		mapProps: VueTypes.object,
		showMarkers: VueTypes.bool.def(true),
		showMarkerClusters : VueTypes.bool.def(false),
		searchAsMove: VueTypes.bool.def(false),
		markerProps: types.props,
		renderItem: VueTypes.func,
		showSearchAsMove: types.bool.def(true),
		autoClosePopover: VueTypes.bool,
		pagination: VueTypes.bool,
		defaultPin: VueTypes.string,
		autoCenter: VueTypes.bool,
		defaultCenter: types.location,
		center: types.location,
		defaultRadius: types.number,
		unit: types.string,
		pages: VueTypes.number.def(5),
	},
	methods: {
		renderMap({
			resultsToRender,
			center,
			zoom,
			handleZoomChange,
			handleOnDragEnd,
			handleOnIdle,
			renderSearchAsMove,
			handlePreserveCenter,
			getPosition,
			markerProps,
			autoClosePopover,
			renderPopover,
			defaultPin,
		}) {
			const style = {
				width: '100%',
				height: '100%',
				position: 'relative',
			};
			return (
				<div style={style}>
					<Map
						ref="mapRef"
						map-type-id="terrain"
						style={{
							height: '100%',
						}}
						options={{
							zoomControl: true,
						}}
						center={center}
						zoom={zoom}
						{...{ props: this.mapProps }}
						onzoom_changed={handleZoomChange}
						ondragend={handleOnDragEnd}
						onidle={handleOnIdle}
					>
						{this.showMarkers ? (
							<GoogleMapMarkers
								resultsToRender={resultsToRender}
								getPosition={getPosition}
								markerProps={markerProps}
								handlePreserveCenter={handlePreserveCenter}
								renderItem={
									this.$scopedSlots.renderItem
										? () => ({
											custom: this.$scopedSlots.renderItem,
										  })
										: this.renderItem
								}
								defaultPin={defaultPin}
								autoClosePopover={autoClosePopover}
								renderPopover={renderPopover}
								showMarkerClusters={this.showMarkerClusters}
							/>
						) : null}
					</Map>
					{renderSearchAsMove()}
				</div>
			);
		},
		getMapRef() {
			return this.mapRef
		}
	},
	mounted() {
		if (this.$refs.mapRef) {
			this.$refs.mapRef.$mapPromise.then(map => {
				this.mapRef = map;
			});
		}
	},
	render() {
		return (
			<RMConnected
				getMapRef={this.getMapRef}
				renderMap={this.renderMap}
				componentId={this.componentId}
				className={this.className}
				dataField={this.dataField}
				defaultZoom={this.defaultZoom}
				react={this.react}
				size={this.size}
				sortBy={this.sortBy}
				pagination={this.pagination}
				URLParams={this.URLParams}
				defaultSearchAsMove={this.searchAsMove}
				showSearchAsMove={this.showSearchAsMove}
				showMarkers={this.showMarkers}
				markerProps={this.markerProps}
				autoClosePopover={this.autoClosePopover}
				defaultPin={this.defaultPin}
				renderPopover={
					this.$scopedSlots.renderPopover
						? item => this.$scopedSlots.renderPopover(item)
						: null
				}
				onZoomChanged={zoom => {
					this.$emit('zoom-changed', zoom);
				}}
				onIdle={() => {
					this.$emit('idle');
				}}
				onDragEnd={() => {
					this.$emit('drag-end');
				}}
				autoCenter={this.autoCenter}
				defaultCenter={this.defaultCenter}
				defaultRadius={this.defaultRadius}
				unit={this.unit}
				pages={this.pages}
				center={this.center}
				{...{
					scopedSlots: this.$scopedSlots,
					on: this.$listeners
				}}
			/>
		);
	},
};

ReactiveGoogleMap.install = function(Vue, options) {
	Vue.component(ReactiveGoogleMap.name, ReactiveGoogleMap);
	if(!options || !options.key) {
		console.error('ReactiveSearch: map key is required to use ReactiveGoogleMap component')
	}
	Vue.use(GmapMapFull, {
		load: {
			key: options.key,
			libraries: 'places',
		},
		installComponents: false,
	});
};

// Add componentType for SSR
ReactiveGoogleMap.componentType = componentTypes.reactiveMap;

export default ReactiveGoogleMap;
