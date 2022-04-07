/* eslint-disable react/forbid-prop-types */
/* global google */
import React, { Component } from 'react';
import { MapContext } from '@react-google-maps/api';
import * as ReactDOM from 'react-dom';
import makeMarkerWithLabel from 'markerwithlabel';
import types from '@appbaseio/reactivecore/lib/utils/types';
import { applyUpdatersToPropsAndRegisterEvents, unregisterEvents } from './helper';

const eventMap = {
	onDblClick: 'dblclick',
	onDragEnd: 'dragend',
	onDragStart: 'dragstart',
	onMouseDown: 'mousedown',
	onMouseOut: 'mouseout',
	onMouseOver: 'mouseover',
	onMouseUp: 'mouseup',
	onRightClick: 'rightclick',
	onAnimationChanged: 'animation_changed',
	onClick: 'click',
	onClickableChanged: 'clickable_changed',
	onCursorChanged: 'cursor_changed',
	onDrag: 'drag',
	onDraggableChanged: 'draggable_changed',
	onFlatChanged: 'flat_changed',
	onIconChanged: 'icon_changed',
	onPositionChanged: 'position_changed',
	onShapeChanged: 'shape_changed',
	onTitleChanged: 'title_changed',
	onVisibleChanged: 'visible_changed',
	onZindexChanged: 'zindex_changed',
};

const updaterMap = {
	/**
	 * For `MarkerWithLabel`
	 * @see https://cdn.rawgit.com/googlemaps/v3-utility-library/master/markerwithlabel/src/markerwithlabel.js
	 */
	labelAnchor(instance, labelAnchor) {
		instance.set('labelAnchor', labelAnchor);
	},

	/**
	 * For `MarkerWithLabel`
	 * @see https://cdn.rawgit.com/googlemaps/v3-utility-library/master/markerwithlabel/src/markerwithlabel.js
	 */
	labelClass(instance, labelClass) {
		instance.set('labelClass', labelClass);
	},

	/**
	 * For `MarkerWithLabel`
	 * @see https://cdn.rawgit.com/googlemaps/v3-utility-library/master/markerwithlabel/src/markerwithlabel.js
	 */
	labelStyle(instance, labelStyle) {
		instance.set('labelStyle', labelStyle);
	},

	/**
	 * For `MarkerWithLabel`
	 * @see https://cdn.rawgit.com/googlemaps/v3-utility-library/master/markerwithlabel/src/markerwithlabel.js
	 */
	labelVisible(instance, labelVisible) {
		instance.set('labelVisible', labelVisible);
	},

	animation(instance, animation) {
		instance.setAnimation(animation);
	},

	clickable(instance, clickable) {
		instance.setClickable(clickable);
	},

	cursor(instance, cursor) {
		instance.setCursor(cursor);
	},

	draggable(instance, draggable) {
		instance.setDraggable(draggable);
	},

	icon(instance, icon) {
		instance.setIcon(icon);
	},

	label(instance, label) {
		instance.setLabel(label);
	},

	opacity(instance, opacity) {
		instance.setOpacity(opacity);
	},

	options(instance, options) {
		instance.setOptions(options);
	},

	place(instance, place) {
		instance.setPlace(place);
	},

	position(instance, position) {
		instance.setPosition(position);
	},

	shape(instance, shape) {
		instance.setShape(shape);
	},

	title(instance, title) {
		instance.setTitle(title);
	},

	visible(instance, visible) {
		instance.setVisible(visible);
	},

	zIndex(instance, zIndex) {
		instance.setZIndex(zIndex);
	},
};

class MarkerWithLabel extends Component {
	static contextType = MapContext;

	componentDidMount() {
		const markerOptions = {
			...(this.props.options || {}),
			...(this.props.clusterer ? {} : { map: this.context }),
			position: this.props.position,
		};

		// Unfortunately we can't just do this in the contstructor, because the
		// `MapContext` might not be filled in yet.
		const NativeMarkerWithLabel = makeMarkerWithLabel(google.maps);
		this.marker = new NativeMarkerWithLabel(markerOptions);

		if (this.props.clusterer) {
			this.props.clusterer.addMarker(this.marker, !!this.props.noClustererRedraw);
		} else {
			this.marker.setMap(this.context);
		}

		this.registeredEvents = applyUpdatersToPropsAndRegisterEvents({
			updaterMap,
			eventMap,
			prevProps: {},
			nextProps: this.props,
			instance: this.marker,
		});
		const container = document.createElement('div');
		ReactDOM.unstable_renderSubtreeIntoContainer(
			this,
			React.Children.only(this.props.children),
			container,
		);
		this.marker.set('labelContent', container);
	}
	componentDidUpdate(prevProps) {
		if (this.marker) {
			unregisterEvents(this.registeredEvents);

			this.registeredEvents = applyUpdatersToPropsAndRegisterEvents({
				updaterMap,
				eventMap,
				prevProps,
				nextProps: this.props,
				instance: this.marker,
			});
		}
	}
	componentWillUnmount() {
		if (this.marker) {
			unregisterEvents(this.registeredEvents);

			if (this.props.clusterer) {
				this.props.clusterer.removeMarker(this.marker, !!this.props.noClustererRedraw);
			} else if (this.marker) {
				if (this.marker.get('labelContent')) {
					ReactDOM.unmountComponentAtNode(this.marker.get('labelContent'));
				}
				this.marker.setMap(null);
			}
		}
	}
	render() {
		return this.props.children;
	}
}
MarkerWithLabel.propTypes = {
	clusterer: types.props,
	options: types.props,
	noClustererRedraw: types.bool,
	position: types.any,
	children: types.children,
};

MarkerWithLabel.defaultProps = {};

export default MarkerWithLabel;
