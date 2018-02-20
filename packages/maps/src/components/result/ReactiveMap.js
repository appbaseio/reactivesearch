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
	checkPropChange,
	getClassName,
	parseHits,
} from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';

import Title from '@appbaseio/reactivesearch/lib/styles/Title';
import { connect } from '@appbaseio/reactivesearch/lib/utils';

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
	componentWillMount() {
		this.props.addComponent(this.props.componentId);
		this.setReact(this.props);
	}

	componentWillReceiveProps(nextProps) {
		checkPropChange(
			this.props.react,
			nextProps.react,
			() => this.setReact(nextProps),
		);
	}

	componentWillUnmount() {
		this.props.removeComponent(this.props.componentId);
	}

	setReact(props) {
		if (props.react) {
			props.watchComponent(props.componentId, props.react);
		}
	}

	getIcon = (result) => {
		if (this.props.onData) {
			return this.props.onData(result);
		}
		return this.props.historicPin;
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
				{this.props.title && <Title className={getClassName(this.props.innerClass, 'title') || null}>{this.props.title}</Title>}
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
			</div>
		);
	}
}

ReactiveMap.propTypes = {
	addComponent: types.funcRequired,
	componentId: types.stringRequired,
	dataField: types.stringRequired,
	setQueryOptions: types.funcRequired,
	defaultQuery: types.func,
	updateQuery: types.funcRequired,
	size: types.number,
	react: types.react,
	hits: types.hits,
	streamHits: types.hits,
	removeComponent: types.funcRequired,
	loadMore: types.funcRequired,
	onData: types.func,
	style: types.style,
	className: types.string,
	stream: types.bool,
	setStreaming: types.func,
	innerClass: types.style,
	url: types.string,
	URLParams: types.bool,
	title: types.title,
	historicPin: types.string,
	defaultCenter: types.location,
};

ReactiveMap.defaultProps = {
	size: 10,
	style: {},
	className: null,
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
