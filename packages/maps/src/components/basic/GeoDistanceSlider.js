import React, { Component } from 'react';
import Downshift from 'downshift';
import { withTheme } from 'emotion-theming';

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryListener,
	setQueryOptions,
} from '@appbaseio/reactivecore/lib/actions';
import {
	isEqual,
	checkValueChange,
	checkPropChange,
	checkSomePropChange,
	getClassName,
	getOptionsFromQuery,
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
import SliderHandle from '@appbaseio/reactivesearch/lib/components/range/addons/SliderHandle';
import { rangeLabelsContainer } from '@appbaseio/reactivesearch/lib/styles/Label';
import { connect } from '@appbaseio/reactivesearch/lib/utils';

class GeoDistanceSlider extends Component {
	constructor(props) {
		super(props);

		this.type = 'geo_distance';
		this.locked = false;
		this.coordinates = null;
		this.autocompleteService = null;

		if (props.autoLocation) {
			this.getUserLocation();
		}
		props.setQueryListener(props.componentId, props.onQueryChange, null);

		props.addComponent(props.componentId);
		this.setReact(props);

		let currentLocation = null;
		let currentDistance = props.range.start || null;

		if (props.selectedValue) {
			currentLocation = props.selectedValue.location || null;
			currentDistance = props.selectedValue.distance || null;
		} else if (props.value) {
			currentLocation = props.value.location || null;
			currentDistance = props.value.distance || null;
		} else if (props.defaultValue) {
			currentLocation = props.defaultValue.location || null;
			currentDistance = props.defaultValue.distance || null;
		}

		this.state = {
			currentLocation,
			currentDistance,
			userLocation: null,
			suggestions: [],
			isOpen: false,
		};

		this.getCoordinates(currentLocation, () => {
			if (currentDistance) {
				this.setDistance(currentDistance);
			}
		});
	}

	componentDidMount() {
		this.autocompleteService = new window.google.maps.places.AutocompleteService();
	}

	componentDidUpdate(prevProps) {
		checkPropChange(this.props.react, prevProps.react, () => this.setReact(prevProps));

		checkSomePropChange(this.props, prevProps, ['dataField', 'nestedField'], () => {
			this.updateQuery(this.state.currentDistance, this.props);
		});

		if (this.props.value && !isEqual(this.props.value, prevProps.value)) {
			this.setValues(this.props.value);
		} else if (
			this.props.selectedValue
			&& this.props.selectedValue.distance
			&& this.props.selectedValue.location
			&& !isEqual(this.state.currentLocation, this.props.selectedValue.location)
			&& !isEqual(this.props.selectedValue, prevProps.selectedValue)
		) {
			const { onChange, value } = this.props;
			if (value === undefined) {
				this.setValues(this.props.selectedValue);
			} else if (onChange) {
				onChange(this.props.selectedValue);
			}
		} else if (
			!isEqual(this.props.selectedValue, prevProps.selectedValue)
			&& !this.props.selectedValue
		) {
			const { value, onChange } = this.props;
			if (value === undefined) {
				// eslint-disable-next-line
				this.setState(
					{
						currentLocation: null,
						currentDistance: null,
					},
					() => {
						this.updateQuery(null);
					},
				);
			} else if (onChange) {
				onChange({
					location: null,
					distance: null,
				});
			}
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
			currentDistance: selected.distance,
		});
		this.getCoordinates(selected.location, () => {
			this.setDistance(selected.distance);
		});
	};

	defaultQuery = (coordinates, distance, props) => {
		let query = null;
		if (coordinates && distance) {
			query = {
				[this.type]: {
					distance: `${distance}${props.unit}`,
					[props.dataField]: coordinates,
				},
			};
		}

		if (query && props.nestedField) {
			return {
				query: {
					nested: {
						path: props.nestedField,
						query,
					},
				},
			};
		}

		return query;
	};

	getUserLocation() {
		navigator.geolocation.getCurrentPosition((location) => {
			const coordinates = `${location.coords.latitude}, ${location.coords.longitude}`;

			fetch(
				`https://maps.googleapis.com/maps/api/geocode/json?key=${
					this.props.mapKey
				}&v=weekly&latlng=${coordinates}`,
			)
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
			fetch(
				`https://maps.googleapis.com/maps/api/geocode/json?key=${
					this.props.mapKey
				}&v=weekly&address=${value}`,
			)
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
			this.setState(
				{
					currentLocation: currentValue.value,
					isOpen: false,
				},
				() => {
					this.getCoordinates(currentValue.value, () => {
						if (this.state.currentDistance) {
							this.updateQuery(this.state.currentDistance);
							if (props.onValueChange) {
								props.onValueChange({
									distance: this.state.currentDistance,
									location: currentValue.value,
								});
							}
						}
						this.locked = false;
					});
				},
			);
		};

		checkValueChange(
			props.componentId,
			{ distance: this.state.currentDistance, location: currentValue.value },
			props.beforeValueChange,
			performUpdate,
		);
	};

	setDistance = (currentDistance) => {
		this.setState(
			{
				currentDistance,
			},
			() => {
				if (this.state.currentLocation) {
					this.updateQuery(currentDistance, this.props);
				}
			},
		);
	};

	updateQuery = (distance, props = this.props) => {
		const {
			componentId, customQuery, filterLabel, showFilter, URLParams,
		} = props;
		let value = null;
		if (distance && this.state.currentLocation) {
			value = {
				distance,
				location: this.state.currentLocation,
				// unit: props.unit,
			};
		}
		let query = this.defaultQuery(this.coordinates, distance, props);
		if (customQuery) {
			const customQueryTobeSet = customQuery(this.coordinates, distance, props);
			if (customQueryTobeSet.query) {
				({ query } = customQueryTobeSet);
			}
			props.setQueryOptions(this.props.componentId, getOptionsFromQuery(customQueryTobeSet));
		}
		props.updateQuery({
			componentId,
			query,
			value,
			label: filterLabel,
			showFilter,
			URLParams,
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
		const { value: valueProp, onChange } = this.props;
		if (valueProp === undefined) {
			this.setState({
				currentLocation: value,
			});
		} else if (onChange) {
			onChange({ location: value, distance: this.state.currentDistance });
		}
		if (value.trim()) {
			if (!this.autocompleteService) {
				this.autocompleteService = new window.google.maps.places.AutocompleteService();
			}

			const restrictedCountries = this.props.countries || [];

			this.autocompleteService.getPlacePredictions(
				{
					input: value,
					componentRestrictions: { country: restrictedCountries },
					...this.props.serviceOptions,
				},
				(res) => {
					const suggestionsList
						= (res
							&& res.map(place => ({
								label: place.description,
								value: place.description,
							})))
						|| [];

					this.setState({
						suggestions: suggestionsList,
					});
				},
			);
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
		const { value, onChange } = this.props;
		if (value === undefined) {
			this.setLocation({ value: this.state.currentLocation });
		} else if (onChange) {
			onChange({
				location: this.state.currentLocation,
				distance: this.state.currentDistance,
			});
		}
	};

	handleStateChange = (changes) => {
		const { isOpen, type } = changes;
		if (type === Downshift.stateChangeTypes.mouseUp) {
			this.setState({
				isOpen,
			});
		}
	};

	handleLocation = (data) => {
		const { value, onChange } = this.props;
		if (value === undefined) {
			this.setLocation(data);
		} else if (onChange) {
			onChange({ location: data.value, distance: this.state.currentDistance });
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

		return (
			<Downshift
				onChange={this.handleLocation}
				onOuterClick={this.handleOuterClick}
				onStateChange={this.handleStateChange}
				isOpen={this.state.isOpen}
				itemToString={i => i}
				render={({
					getInputProps, getItemProps, isOpen, highlightedIndex,
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
						<InputIcon iconPosition={this.props.iconPosition}>
							{this.renderIcon()}
						</InputIcon>
						{isOpen && this.state.suggestions.length ? (
							<ul
								className={`${suggestions(themePreset, theme)} ${getClassName(
									this.props.innerClass,
									'list',
								)}`}
							>
								{suggestionsList.slice(0, 11).map((item, index) => (
									<li
										{...getItemProps({ item })}
										key={item.label}
										style={{
											backgroundColor:
												highlightedIndex === index ? '#eee' : '#fff',
										}}
									>
										{typeof item.label === 'string' ? (
											<div
												className="trim"
												dangerouslySetInnerHTML={{
													__html: item.label,
												}}
											/>
										) : (
											item.label
										)}
									</li>
								))}
							</ul>
						) : null}
					</div>
				)}
			/>
		);
	};

	handleSlider = ({ values }) => {
		const { value, onChange } = this.props;
		if (value === undefined) {
			if (values[0] !== this.state.currentDistance) {
				this.setDistance(values[0]);
			}
		} else if (onChange) {
			// As rheostat do not follow controlled behavior we need to force update the component
			this.forceUpdate();
			onChange({ distance: values[0], location: this.state.currentLocation });
		}
	};

	render() {
		return (
			<Slider primary style={this.props.style} className={this.props.className}>
				{this.props.title && (
					<Title className={getClassName(this.props.innerClass, 'title') || null}>
						{this.props.title}
					</Title>
				)}
				{this.renderSearchBox()}
				<Rheostat
					min={this.props.range.start}
					max={this.props.range.end}
					values={[this.state.currentDistance]}
					onChange={this.handleSlider}
					className={getClassName(this.props.innerClass, 'slider')}
					handle={({ className, style, ...passProps }) => (
						<SliderHandle
							style={style}
							className={className}
							{...passProps}
							renderTooltipData={this.props.renderTooltipData}
							tooltipTrigger={this.props.tooltipTrigger}
						/>
					)}
				/>
				{this.props.rangeLabels ? (
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
				) : null}
			</Slider>
		);
	}
}

GeoDistanceSlider.propTypes = {
	addComponent: types.funcRequired,
	mapKey: types.stringRequired,
	removeComponent: types.funcRequired,
	selectedValue: types.selectedValue,
	setQueryListener: types.funcRequired,
	themePreset: types.themePreset,
	updateQuery: types.funcRequired,
	watchComponent: types.funcRequired,
	// component props
	autoLocation: types.bool,
	beforeValueChange: types.func,
	className: types.string,
	componentId: types.stringRequired,
	countries: types.stringArray,
	customQuery: types.func,
	data: types.data,
	dataField: types.stringRequired,
	defaultValue: types.selectedValue,
	filterLabel: types.string,
	icon: types.children,
	iconPosition: types.iconPosition,
	innerClass: types.style,
	innerRef: types.func,
	nestedField: types.string,
	onBlur: types.func,
	onChange: types.func,
	onFocus: types.func,
	onKeyDown: types.func,
	onKeyPress: types.func,
	onKeyUp: types.func,
	onQueryChange: types.func,
	onValueChange: types.func,
	placeholder: types.string,
	range: types.range,
	rangeLabels: types.rangeLabels,
	react: types.react,
	setQueryOptions: types.funcRequired,
	showFilter: types.bool,
	showIcon: types.bool,
	tooltipTrigger: types.tooltipTrigger,
	renderTooltipData: types.func,
	style: types.style,
	theme: types.style,
	title: types.title,
	value: types.selectedValue,
	unit: types.string,
	URLParams: types.bool,
	...this.props.serviceOptions,
};

GeoDistanceSlider.defaultProps = {
	className: null,
	placeholder: 'Select a value',
	range: {
		start: 1,
		end: 200,
	},
	showFilter: true,
	tooltipTrigger: 'none',
	style: {},
	URLParams: false,
	autoLocation: true,
	unit: 'mi',
	countries: [],
};

const mapStateToProps = (state, props) => ({
	mapKey: state.config.mapKey,
	selectedValue:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].value)
		|| null,
	themePreset: state.config.themePreset,
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	setQueryListener: (component, onQueryChange, beforeQueryChange) =>
		dispatch(setQueryListener(component, onQueryChange, beforeQueryChange)),
	setQueryOptions: (component, props) => dispatch(setQueryOptions(component, props)),
});

export default connect(
	mapStateToProps,
	mapDispatchtoProps,
)(withTheme(GeoDistanceSlider));
