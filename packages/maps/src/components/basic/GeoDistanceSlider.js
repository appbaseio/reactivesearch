import React, { Component } from 'react';
import Downshift from 'downshift';
import { withTheme } from 'emotion-theming';

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
} from '@appbaseio/reactivecore/lib/actions';
import {
	isEqual,
	checkValueChange,
	checkPropChange,
	getClassName,
} from '@appbaseio/reactivecore/lib/utils/helper';
import Rheostat from 'rheostat/lib/Slider';

import types from '@appbaseio/reactivecore/lib/utils/types';

import Title from '@appbaseio/reactivesearch/lib/styles/Title';
import Input, {
	suggestionsContainer,
	suggestions,
} from '@appbaseio/reactivesearch/lib/styles/Input';
import InputIcon from '@appbaseio/reactivesearch/lib/styles/InputIcon';
import SearchSvg from '@appbaseio/reactivesearch/lib/components/shared/SearchSvg';
import Slider from '@appbaseio/reactivesearch/lib/styles/Slider';
import RangeLabel from '@appbaseio/reactivesearch/lib/components/range/addons/RangeLabel';
import { rangeLabelsContainer } from '@appbaseio/reactivesearch/lib/styles/Label';
import { connect } from '@appbaseio/reactivesearch/lib/utils';

class GeoDistanceSlider extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentLocation: null,
			currentDistance: props.range.start,
			userLocation: null,
			suggestions: [],
			isOpen: false,
		};
		this.type = 'geo_distance';
		this.locked = false;
		this.coordinates = null;
		this.autocompleteService = null;

		if (props.autoLocation) {
			this.getUserLocation();
		}
	}

	componentWillMount() {
		this.props.addComponent(this.props.componentId);
		this.setReact(this.props);

		if (this.props.selectedValue && this.props.selectedValue.location) {
			this.setState({
				currentLocation: this.props.selectedValue.location,
			}, () => {
				this.getCoordinates(this.props.selectedValue.location, () => {
					if (this.props.selectedValue.distance) {
						this.setDistance(this.props.selectedValue.distance);
					}
				});
			});
		} else if (this.props.defaultSelected && this.props.defaultSelected.location) {
			this.setState({
				currentLocation: this.props.defaultSelected.location,
			}, () => {
				this.getCoordinates(this.props.defaultSelected.location, () => {
					if (this.props.defaultSelected.distance) {
						this.setDistance(this.props.defaultSelected.distance);
					}
				});
			});
		}
	}

	componentDidMount() {
		this.autocompleteService = new window.google.maps.places.AutocompleteService();
	}

	componentWillReceiveProps(nextProps) {
		checkPropChange(
			this.props.react,
			nextProps.react,
			() => this.setReact(nextProps),
		);

		checkPropChange(this.props.dataField, nextProps.dataField, () => {
			this.updateQuery(this.state.currentDistance, nextProps);
		});

		if (
			nextProps.defaultSelected
			&& nextProps.defaultSelected.distance
			&& nextProps.defaultSelected.location
			&& !isEqual(this.props.defaultSelected, nextProps.defaultSelected)
		) {
			this.setValues(nextProps.defaultSelected);
		} else if (
			nextProps.selectedValue
			&& nextProps.selectedValue.distance
			&& nextProps.selectedValue.location
			&& !isEqual(this.state.currentLocation, nextProps.selectedValue.location)
		) {
			this.setValues(nextProps.selectedValue);
		} else if (
			!isEqual(this.props.selectedValue, nextProps.selectedValue)
			&& !nextProps.selectedValue
		) {
			this.setState({
				currentLocation: null,
				currentDistance: null,
			}, () => {
				this.updateQuery(null);
			});
		}
	}

	componentWillUnmount() {
		this.props.removeComponent(this.props.componentId);
	}

	setReact(props) {
		if (props.react) {
			props.watchComponent(props.componentId, props.react);
		}
	}

	setValues = (selected) => {
		this.setState({
			currentLocation: selected.location,
		});
		this.getCoordinates(selected.location, () => {
			this.setDistance(selected.distance);
		});
	}

	defaultQuery = (coordinates, distance, props) => {
		if (coordinates && distance) {
			return {
				[this.type]: {
					distance: `${distance}${props.unit}`,
					[props.dataField]: coordinates,
				},
			};
		}
		return null;
	};

	getUserLocation() {
		navigator.geolocation.getCurrentPosition((location) => {
			const coordinates = `${location.coords.latitude}, ${location.coords.longitude}`;

			fetch(`https://maps.googleapis.com/maps/api/geocode/json?key=${this.props.mapKey}&v=3.31&latlng=${coordinates}`)
				.then(res => res.json())
				.then((res) => {
					if (Array.isArray(res.results) && res.results.length) {
						const userLocation = res.results[0].formatted_address;
						this.setState({
							userLocation,
						});
					}
				})
				.catch((e) => {
					console.error(e);
				});
		});
	}

	getCoordinates(value, cb) {
		if (value) {
			fetch(`https://maps.googleapis.com/maps/api/geocode/json?key=${this.props.mapKey}&v=3.31&address=${value}`)
				.then(res => res.json())
				.then((res) => {
					if (Array.isArray(res.results) && res.results.length) {
						const { location } = res.results[0].geometry;
						this.coordinates = `${location.lat}, ${location.lng}`;
					}
				})
				.then(() => {
					if (cb) cb();
				})
				.catch((e) => {
					console.error(e);
				});
		}
	}

	setLocation = (currentValue, props = this.props) => {
		// ignore state updates when component is locked
		if (props.beforeValueChange && this.locked) {
			return;
		}

		this.locked = true;

		const performUpdate = () => {
			this.setState({
				currentLocation: currentValue.value,
				isOpen: false,
			}, () => {
				this.getCoordinates(currentValue.value, () => {
					if (this.state.currentDistance) {
						this.updateQuery(this.state.currentDistance);
					}
					this.locked = false;
				});
			});
		};

		checkValueChange(
			props.componentId,
			{ distance: this.state.currentDistance, location: currentValue.value },
			props.beforeValueChange,
			props.onValueChange,
			performUpdate,
		);
	};

	setDistance = (currentDistance) => {
		this.setState({
			currentDistance,
		}, () => {
			if (this.state.currentLocation) {
				this.updateQuery(currentDistance, this.props);
			}
		});
	};

	updateQuery = (distance, props = this.props) => {
		const query = props.customQuery || this.defaultQuery;
		const { onQueryChange = null } = props;

		let value = null;
		if (distance && this.state.currentLocation) {
			value = {
				distance,
				location: this.state.currentLocation,
				// unit: props.unit,
			};
		}

		props.updateQuery({
			componentId: props.componentId,
			query: query(this.coordinates, distance, props),
			value,
			label: props.filterLabel,
			showFilter: props.showFilter,
			onQueryChange,
			URLParams: props.URLParams,
		});
	};

	renderIcon = () => {
		if (this.props.showIcon) {
			return this.props.icon || <SearchSvg />;
		}
		return null;
	};

	onInputChange = (e) => {
		const { value } = e.target;
		this.setState({
			currentLocation: value,
		});
		if (value.trim()) {
			if (!this.autocompleteService) {
				this.autocompleteService = new window.google.maps.places.AutocompleteService();
			}

			this.autocompleteService.getPlacePredictions({ input: value }, (res) => {
				const suggestionsList = (res && res.map(place => ({
					label: place.description,
					value: place.description,
				}))) || [];

				this.setState({
					suggestions: suggestionsList,
				});
			});
		} else {
			this.setState({
				suggestions: [],
			});
		}
	};

	handleFocus = (event) => {
		this.setState({
			isOpen: true,
		});
		if (this.props.onFocus) {
			this.props.onFocus(event);
		}
	};

	handleOuterClick = () => {
		this.setLocation({ value: this.state.currentLocation });
	};

	handleStateChange = (changes) => {
		const { isOpen, type } = changes;
		if (type === Downshift.stateChangeTypes.mouseUp) {
			this.setState({
				isOpen,
			});
		}
	};

	renderSearchBox = () => {
		let suggestionsList = [...this.state.suggestions];
		const { theme, themePreset } = this.props;

		if (this.state.userLocation) {
			suggestionsList = [
				{
					label: 'Use my current location',
					value: this.state.userLocation,
				},
				...this.state.suggestions,
			];
		}

		return (<Downshift
			onChange={this.setLocation}
			onOuterClick={this.handleOuterClick}
			onStateChange={this.handleStateChange}
			isOpen={this.state.isOpen}
			itemToString={i => i}
			render={({
				getInputProps,
				getItemProps,
				isOpen,
				highlightedIndex,
			}) => (
				<div className={suggestionsContainer}>
					<Input
						showIcon={this.props.showIcon}
						iconPosition={this.props.iconPosition}
						innerRef={this.props.innerRef}
						{...getInputProps({
							className: getClassName(this.props.innerClass, 'input'),
							placeholder: this.props.placeholder,
							value: this.state.currentLocation || '',
							onChange: this.onInputChange,
							onBlur: this.props.onBlur,
							onFocus: this.handleFocus,
							onKeyPress: this.props.onKeyPress,
							onKeyDown: this.handleKeyDown,
							onKeyUp: this.props.onKeyUp,
						})}
						themePreset={themePreset}
					/>
					<InputIcon iconPosition={this.props.iconPosition}>{this.renderIcon()}</InputIcon>
					{
						isOpen && this.state.suggestions.length
							? (
								<ul className={`${suggestions(themePreset, theme)} ${getClassName(this.props.innerClass, 'list')}`}>
									{
										suggestionsList
											.slice(0, 11)
											.map((item, index) => (
												<li
													{...getItemProps({ item })}
													key={item.label}
													style={{
														backgroundColor: highlightedIndex === index
															? '#eee' : '#fff',
													}}
												>
													{
														typeof item.label === 'string'
															? <div
																className="trim"
																dangerouslySetInnerHTML={{
																	__html: item.label,
																}}
															/>
															: item.label
													}
												</li>
											))
									}
								</ul>
							)
							: null
					}
				</div>
			)}
		/>);
	};

	handleSlider = ({ values }) => {
		if (values[0] !== this.state.currentDistance) {
			this.setDistance(values[0]);
		}
	};

	render() {
		return (
			<Slider primary style={this.props.style} className={this.props.className}>
				{this.props.title && <Title className={getClassName(this.props.innerClass, 'title') || null}>{this.props.title}</Title>}
				{this.renderSearchBox()}
				<Rheostat
					min={this.props.range.start}
					max={this.props.range.end}
					values={[this.state.currentDistance]}
					onChange={this.handleSlider}
					className={getClassName(this.props.innerClass, 'slider')}
				/>
				{
					this.props.rangeLabels
						? (
							<div className={rangeLabelsContainer}>
								<RangeLabel
									align="left"
									className={getClassName(this.props.innerClass, 'label') || null}
								>
									{this.props.rangeLabels.start}
								</RangeLabel>
								<RangeLabel
									align="right"
									className={getClassName(this.props.innerClass, 'label') || null}
								>
									{this.props.rangeLabels.end}
								</RangeLabel>
							</div>
						)
						: null
				}
			</Slider>
		);
	}
}

GeoDistanceSlider.propTypes = {
	addComponent: types.funcRequired,
	removeComponent: types.funcRequired,
	updateQuery: types.funcRequired,
	watchComponent: types.funcRequired,
	selectedValue: types.selectedValue,
	// component props
	beforeValueChange: types.func,
	className: types.string,
	componentId: types.stringRequired,
	customQuery: types.func,
	data: types.data,
	dataField: types.stringRequired,
	defaultSelected: types.selectedValue,
	filterLabel: types.string,
	innerClass: types.style,
	innerRef: types.func,
	onQueryChange: types.func,
	onValueChange: types.func,
	placeholder: types.string,
	react: types.react,
	showFilter: types.bool,
	style: types.style,
	title: types.title,
	URLParams: types.boolRequired,
	unit: types.string,
	showIcon: types.bool,
	onBlur: types.func,
	onFocus: types.func,
	onKeyDown: types.func,
	onKeyPress: types.func,
	onKeyUp: types.func,
	icon: types.children,
	iconPosition: types.iconPosition,
	mapKey: types.stringRequired,
	autoLocation: types.boolRequired,
	range: types.range,
	rangeLabels: types.rangeLabels,
	theme: types.style,
	themePreset: types.themePreset,
};

GeoDistanceSlider.defaultProps = {
	className: null,
	placeholder: 'Select a value',
	range: {
		start: 1,
		end: 200,
	},
	showFilter: true,
	style: {},
	URLParams: false,
	autoLocation: true,
};

const mapStateToProps = (state, props) => ({
	mapKey: state.config.mapKey,
	selectedValue: (
		state.selectedValues[props.componentId]
		&& state.selectedValues[props.componentId].value
	) || null,
	themePreset: state.config.themePreset,
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
});

export default connect(
	mapStateToProps,
	mapDispatchtoProps,
)(withTheme(GeoDistanceSlider));
