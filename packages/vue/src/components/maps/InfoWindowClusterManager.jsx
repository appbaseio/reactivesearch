import { infoWindowMappedProps, bindEvents, bindProps, getPropsValues } from './utils';

const InfoWindowClusterManager = {
	name: 'InfoWindowClusterManager',
	inject: {
		$markerPromise: {
			default: null,
		},
		$mapPromise: {},
	},
	provide() {
		const events = ['domready', 'closeclick', 'content_changed'];
		// Infowindow needs this to be immediately available
		const promise = this.$mapPromise
			.then((map) => {
				this.$map = map;
				// Initialize the maps with the given options
				const initialOptions = {
					// TODO: analyze the below line because I think it can be removed
					...this.options,
					map,
					...getPropsValues(this, infoWindowMappedProps),
				};
				const { options: extraOptions, position, ...finalOptions } = initialOptions;
				finalOptions.content = this.$refs.flyaway;
				if (this.$markerPromise) {
					this.$markerPromise.then((markerObject) => {
						this.$markerObject = markerObject;
						// eslint-disable-next-line
						this.$infoWindowObject = new google.maps.InfoWindow(finalOptions);
						bindProps(this, this.$infoWindowObject, infoWindowMappedProps);
						bindEvents(this, this.$infoWindowObject, events);
						// TODO: This function names should be analyzed
						/* eslint-disable no-underscore-dangle -- old style */
						this._openInfoWindow();
						this.$watch('opened', () => {
							this._openInfoWindow();
						});
						/* eslint-enable no-underscore-dangle */
						return this.$infoWindowObject;
					});
				}
			})
			.catch((error) => {
				throw error;
			});
		// TODO: analyze the efects of only returns the instance and remove completely the promise
		this.$infoWindowPromise = promise;
		return { $infoWindowPromise: promise };
	},
	props: {
		/**
		 * NOTE: This prop overrides the content of the default slot, use only one of them, not both at the same time
		 * Content to display in the InfoWindow. This can be an HTML element, a plain-text string, or a string containing HTML. The InfoWindow will be sized according to the content. To set an explicit size for the content, set content to be a HTML element with that size.
		 * @value undefined
		 * @see [InfoWindow content](https://developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindowOptions.content)
		 */
		content: {
			type: [String, Object],
			default: undefined,
		},
		/**
		 * Determines if the info-window is open or not
		 */
		opened: {
			type: Boolean,
			default: true,
		},
		/**
		 * Contains the LatLng at which this info window is anchored.
		 * Note: An InfoWindow may be attached either to a Marker object
		 * (in which case its position is based on the marker's location)
		 * or on the map itself at a specified LatLng.
		 *
		 * The LatLng at which to display this InfoWindow. If the InfoWindow is opened with an anchor, the anchor's position will be used instead.
		 * @value undefined
		 * @type LatLng|LatLngLiteral
		 * @see [InfoWindow position](https://developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindowOptions.position)
		 */
		position: {
			type: Object,
			default: undefined,
		},
		/**
		 * All InfoWindows are displayed on the map in order of their zIndex, with higher values displaying in front of InfoWindows with lower values. By default, InfoWindows are displayed according to their latitude, with InfoWindows of lower latitudes appearing in front of InfoWindows at higher latitudes. InfoWindows are always displayed in front of markers.
		 * @value 0
		 * @see [InfoWindow position](https://developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindowOptions.zIndex)
		 */
		zIndex: {
			type: Number,
			default: 0,
		},
		/**
		 * Extra options that you want to pass to the component
		 */
		options: {
			type: Object,
			required: false,
			default: undefined,
		},
	},
	mounted() {
		const el = this.$refs.flyaway;
		el.parentNode.removeChild(el);
	},
	destroyed() {
		// Note: not all Google Maps components support maps
		if (this.$infoWindowObject && this.$infoWindowObject.setMap) {
			this.$infoWindowObject.setMap(null);
		}
	},
	methods: {
		// TODO: we need to analyze the following method name
		// eslint-disable-next-line no-underscore-dangle -- old code
		_openInfoWindow() {
			if (this.opened) {
				if (this.$markerObject !== null) {
					this.$infoWindowObject.open(this.$map, this.$markerObject);
				} else {
					this.$infoWindowObject.open(this.$map);
				}
			} else {
				this.$infoWindowObject.close();
			}
		},
	},
	render() {
		return (
			<div>
				<div ref="flyaway">
					{/* so named because it will fly away to another component --> */}
					{/* @slot Used to set your info window.  --> */}
					{this.$scopedSlots.default()}
				</div>
			</div>
		);
	},
};

export default InfoWindowClusterManager;
