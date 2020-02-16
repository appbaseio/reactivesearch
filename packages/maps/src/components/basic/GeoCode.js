import { Component } from 'react';

class GeoCode extends Component {
	getUserLocation() {
		navigator.geolocation.getCurrentPosition((location) => {
			const coordinatesObj = {
				lat: location.coords.latitude,
				lng: location.coords.longitude,
			};

			if (this.geocoder) {
				this.geocoder.geocode({ location: coordinatesObj }, (results, status) => {
					if (status === 'OK') {
						if (Array.isArray(results) && results.length) {
							const userLocation = results[0].formatted_address;
							this.setState({
								// eslint-disable-next-line react/no-unused-state
								userLocation,
							});
						}
					} else {
						console.error(`Geocode was not successful for the following reason: ${status}`);
					}
				});
			} else {
				console.error('No Geocoder found or defined');
			}
		});
	}

	getCoordinates(value, cb) {
		if (value) {
			if (this.geocoder) {
				this.geocoder.geocode({ address: value }, (results, status) => {
					if (status === 'OK') {
						if (Array.isArray(results) && results.length) {
							if (Array.isArray(results) && results.length) {
								const { location } = results[0].geometry;
								this.coordinates = `${location.lat()}, ${location.lng()}`;
								if (cb) cb();
							}
						}
					} else {
						console.error(`Geocode was not successful for the following reason: ${status}`);
					}
				});
			} else {
				console.error('No Geocoder found or defined');
			}
		}
	}
}

export default GeoCode;
