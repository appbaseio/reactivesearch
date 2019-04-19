import React, { Component } from 'react';
import Downshift from 'downshift';
import { withTheme } from 'emotion-theming';

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryListener,
} from '@appbaseio/reactivecore/lib/actions';
import {
	isEqual,
	checkValueChange,
	checkSomePropChange,
	checkPropChange,
	getClassName,
} from '@appbaseio/reactivecore/lib/utils/helper';

import types from '@appbaseio/reactivecore/lib/utils/types';

import Title from '@appbaseio/reactivesearch/lib/styles/Title';
import Input, {
	suggestionsContainer,
	suggestions,
} from '@appbaseio/reactivesearch/lib/styles/Input';
import InputIcon from '@appbaseio/reactivesearch/lib/styles/InputIcon';
import Container from '@appbaseio/reactivesearch/lib/styles/Container';
import SearchSvg from '@appbaseio/reactivesearch/lib/components/shared/SearchSvg';
import Dropdown from '@appbaseio/reactivesearch/lib/components/shared/Dropdown';
import { connect } from '@appbaseio/reactivesearch/lib/utils';

class GeoDistanceDropdown extends Component {
	constructor(props) {
		super(props);

		this.type = 'geo_distance';
		this.locked = false;
		this.coordinates = null;
		this.autocompleteService = null;

		if (props.autoLocation) {
			this.getUserLocation();
		}

		let currentLocation = null;
		let currentDistance = 0;

		props.addComponent(props.componentId);
		props.setQueryListener(props.componentId, props.onQueryChange, null);
		this.setReact(props);

		if (props.value) {
			currentLocation = props.value.location;
			const selected = props.data.find(
				item => item.label === props.value.label,
			);

			currentDistance = selected.distance;
		} else if (props.selectedValue) {
			currentLocation = props.selectedValue.location;
			const selected = props.data.find(
				item => item.label === props.selectedValue.label,
			);

			currentDistance = selected.distance;
		} else if (props.defaultValue) {
			currentLocation = props.defaultValue.location;
			const selected = props.data.find(
				item => item.label === props.defaultValue.label,
			);
			currentDistance = selected.distance;
		}


		this.state = {
			currentLocation,
			currentDistance,
			userLocation: null,
			suggestions: [],
			isOpen: false,
		};
		this.getCoordinates(currentLocation, () => {
			this.setDistance(currentDistance);
		});
	}

	componentDidMount() {
		this.autocompleteService = new window.google.maps.places.AutocompleteService();
	}

	componentDidUpdate(prevProps) {
		checkPropChange(this.props.react, prevProps.react, () => this.setReact(this.props));

		checkSomePropChange(this.props, prevProps, ['dataField', 'nestedField'], () => {
			this.updateQuery(this.state.currentDistance, this.props);
		});

		if (
			this.props.value
			&& !isEqual(this.props.value, prevProps.value)
		) {
			this.setValues(this.props.value, this.props);
		} else if (
			this.props.selectedValue
			&& this.props.selectedValue.label
			&& this.props.selectedValue.location
			&& !isEqual(this.state.currentLocation, this.props.selectedValue.location)
			&& !isEqual(this.props.selectedValue, prevProps.selectedValue)
		) {
			const { value, onChange } = this.props;

			if (value === undefined) {
				this.setValues(this.props.selectedValue, this.props);
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
				onChange(null);
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

	setValues = (selected, props) => {
		const selectedDistance = props.data.find(item => item.label === selected.label);
		this.setState({
			currentLocation: selected.location,
			currentDistance: selectedDistance.distance,
		});
		this.getCoordinates(selected.location, () => {
			this.setDistance(selectedDistance.distance);
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

	getSelectedLabel = distance => this.props.data.find(item => item.distance === distance);

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
									label: this.getSelectedLabel(this.state.currentDistance),
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
			{
				label: this.getSelectedLabel(this.state.currentDistance),
				location: currentValue.value,
			},
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
				this.updateQuery(currentDistance, this.props);
				if (this.props.onValueChange) {
					this.props.onValueChange({
						label: this.getSelectedLabel(currentDistance),
						location: this.state.currentLocation,
					});
				}
			},
		);

	};

	updateQuery = (distance, props = this.props) => {
		const query = props.customQuery || this.defaultQuery;
		const selectedDistance = this.getSelectedLabel(distance);
		let value = null;
		if (selectedDistance) {
			value = {
				label: selectedDistance.label,
				location: this.state.currentLocation,
			};
		}

		props.updateQuery({
			componentId: props.componentId,
			query: query(this.coordinates, distance, props),
			value,
			label: props.filterLabel,
			showFilter: props.showFilter,
			URLParams: props.URLParams,
		});
	};

	renderIcon = () => {
		if (this.props.showIcon) {
			return this.props.icon || <SearchSvg />;
		}
		return null;
	};

	onDistanceChange = (value) => {
		const { onChange, value: valueProp } = this.props;
		if (valueProp === undefined) {
			this.setDistance(value.distance);
		} else if (onChange) {
			onChange({ label: value.label, location: this.state.currentLocation });
		}
	};

	onInputChange = (e) => {
		const { value } = e.target;
		const { onChange, value: propValue } = this.props;

		if (propValue === undefined) {
			this.setState({
				currentLocation: value,
			});
		} else if (onChange) {
			onChange({
				location: value,
				label: this.props.value.label,
			});
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
		const { onChange, value } = this.props;

		if (value === undefined) {
			this.setLocation({ value: this.state.currentLocation });
		} else if (onChange) {
			onChange({
				location: this.state.currentLocation,
				label: this.props.value.label,
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
			onChange({
				location: data.value,
				label: this.props.value.label,
			});
		}
	}

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

	render() {
		return (
			<Container style={this.props.style} className={this.props.className}>
				{this.props.title && (
					<Title className={getClassName(this.props.innerClass, 'title') || null}>
						{this.props.title}
					</Title>
				)}
				{this.renderSearchBox()}
				<Dropdown
					innerClass={this.props.innerClass}
					items={this.props.data}
					onChange={this.onDistanceChange}
					selectedItem={this.getSelectedLabel(this.state.currentDistance)}
					placeholder="Select distance"
					keyField="label"
					returnsObject
					themePreset={this.props.themePreset}
				/>
			</Container>
		);
	}
}

GeoDistanceDropdown.propTypes = {
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
	react: types.react,
	value: types.selectedValue,
	showFilter: types.bool,
	showIcon: types.bool,
	style: types.style,
	theme: types.style,
	title: types.title,
	unit: types.string,
	URLParams: types.bool,
};

GeoDistanceDropdown.defaultProps = {
	className: null,
	placeholder: 'Select a value',
	showFilter: true,
	style: {},
	URLParams: false,
	countries: [],
	autoLocation: true,
	unit: 'mi',
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
});

export default connect(
	mapStateToProps,
	mapDispatchtoProps,
)(withTheme(GeoDistanceDropdown));
