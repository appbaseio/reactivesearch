import { MapElementMixin } from 'gmap-vue';
import VueTypes from 'vue-types';

// Note: This file has been taken from https://github.com/eregnier/vue2-gmap-custom-marker/blob/master/gmap-custom-marker.vue
const MarkerWithLabel = {
	props: {
		marker: {
			type: Object,
			default: undefined,
		},
		offsetX: {
			type: Number,
			default: 0,
		},
		offsetY: {
			type: Number,
			default: 0,
		},
		alignment: {
			type: String,
			default: 'top',
		},
		zIndex: {
			type: Number,
			default: 50,
		},
		cssPosition: {
			type: Boolean,
			default: false,
		},
		renderMarker: VueTypes.func.isRequired,
		handleMouseOver: VueTypes.func,
		handleFocus: VueTypes.func,
		handleMouseOut: VueTypes.func,
		handleBlur: VueTypes.func,
		handleClick: VueTypes.func,
	},
	data() {
		return {
			opacity: 0.01,
		};
	},
	mixins: [MapElementMixin],
	inject: {
		$clusterPromise: {
			default: null,
		},
	},
	computed: {
		lat() {
			return parseFloat(
				Number.isNaN(this.marker.lat) ? this.marker.latitude : this.marker.lat,
			);
		},
		lng() {
			return parseFloat(
				Number.isNaN(this.marker.lng) ? this.marker.longitude : this.marker.lng,
			);
		},
		latLng() {
			if (this.marker instanceof window.google.maps.LatLng) {
				return this.marker;
			}
			return new window.google.maps.LatLng(this.lat, this.lng);
		},
	},
	watch: {
		marker() {
			this.$mapPromise.then(() => this.$overlay.setPosition());
		},
		zIndex() {
			if (this.$overlay) {
				this.$overlay.repaint();
			}
		},
	},
	beforeCreate(options) {
		if (this.$clusterPromise) {
			// eslint-disable-next-line
			options.map = null;
		}
		return this.$clusterPromise;
	},
	destroyed() {
		if (this.$clusterObject) {
			this.$clusterObject.removeMarker(this.$overlay, true);
		} else if (this.$overlay) {
			this.$overlay.setMap(null);
			this.$overlay = undefined;
		}
	},
	provide() {
		const self = this;
		return this.$mapPromise.then(map => {
			class Overlay extends window.google.maps.OverlayView {
				constructor(map2) {
					super();
					this.setMap(map2);
					this.draw = () => this.repaint();
					this.setPosition = () => this.repaint();
				}
				repaint() {
					const div = self.$el;
					const projection = this.getProjection();
					if (projection && div) {
						const posPixel = projection.fromLatLngToDivPixel(self.latLng);
						let x;
						let y;
						switch (self.alignment) {
							case 'top':
								x = posPixel.x - div.offsetWidth / 2;
								y = posPixel.y - div.offsetHeight;
								break;
							case 'bottom':
								x = posPixel.x - div.offsetWidth / 2;
								({ y } = posPixel);
								break;
							case 'left':
								x = posPixel.x - div.offsetWidth;
								y = posPixel.y - div.offsetHeight / 2;
								break;
							case 'right':
								({ x } = posPixel);
								y = posPixel.y - div.offsetHeight / 2;
								break;
							case 'center':
								x = posPixel.x - div.offsetWidth / 2;
								y = posPixel.y - div.offsetHeight / 2;
								break;
							case 'topleft':
							case 'lefttop':
								x = posPixel.x - div.offsetWidth;
								y = posPixel.y - div.offsetHeight;
								break;
							case 'topright':
							case 'righttop':
								({ x } = posPixel);
								y = posPixel.y - div.offsetHeight;
								break;
							case 'bottomleft':
							case 'leftop':
								x = posPixel.x - div.offsetWidth;
								({ y } = posPixel);
								break;
							case 'bottomright':
							case 'rightbottom':
								({ x } = posPixel);
								({ y } = posPixel);
								break;
							default:
								throw new Error('Invalid alignment type of custom marker!');
						}
						if (self.cssPosition) {
							div.style.transform = `translate(${x + self.offsetX}px, ${y
								+ self.offsetY}px)`;
						} else {
							div.style.left = `${x + self.offsetX}px`;
							div.style.top = `${y + self.offsetY}px`;
						}
						div.style['z-index'] = self.zIndex;
					}
				}
				onAdd() {
					if (this.$clusterObject) {
						this.$clusterObject.removeMarker(this.$overlay, true);
					} else if (this.$overlay) {
						this.$overlay.setMap(null);
						this.$overlay = undefined;
					}
					const div = self.$el;
					const panes = this.getPanes();
					div.style.position = 'absolute';
					div.style.display = 'inline-block';
					div.style.zIndex = self.zIndex;
					panes.overlayLayer.appendChild(div);
					panes.overlayMouseTarget.appendChild(div);
					this.getDraggable = () => false;
					this.getPosition = () => new window.google.maps.LatLng(self.lat, self.lng);
					self.afterCreate(this);
				}
				// eslint-disable-next-line
				onRemove() {
					if (self.$el) {
						const ua = window.navigator.userAgent;
						const msie = ua.indexOf('MSIE ');
						// eslint-disable-next-line
						if (msie > 0 || !!ua.match(/Trident.*rv\:11\./)) {
							self.$el.parentNode.removeChild(self.$el);
						} else {
							self.$el.remove();
						}
					}
				}
			}
			this.$overlay = new Overlay(map);
			setTimeout(() => {
				if (this.$overlay) {
					this.$overlay.repaint();
					this.opacity = 1;
				}
			}, 100);
		});
	},
	methods: {
		afterCreate(inst) {
			if (this.$clusterPromise && !this.isMarkerAdded) {
				this.$clusterPromise.then(co => {
					co.addMarker(inst);
					this.$clusterObject = co;
					this.isMarkerAdded = true;
				});
			}
		},
	},
	render() {
		return (
			<div
				style={{
					opacity: this.opacity,
				}}
				onmouseover={this.handleMouseOver}
				onfocus={this.handleFocus}
				onmouseout={this.handleMouseOut}
				onblur={this.handleBlur}
				onclick={this.handleClick}
			>
				{this.renderMarker()}
			</div>
		);
	},
};

export default MarkerWithLabel;
