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
	checkPropChange,
	getClassName,
	pushToAndClause,
} from '@appbaseio/reactivecore/lib/utils/helper';
import getSuggestions from '@appbaseio/reactivecore/lib/utils/suggestions';
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

		this.state = {
			currentLocation: null,
			currentDistance: 0,
			userLocation: null,
			suggestions: [],
			isOpen: false,
		};
		this.type = 'geo_distance';
		this.internalComponent = `${props.componentId}__internal`;
		this.locked = false;
		this.coordinates = null;
		this.autocompleteService = null;

		if (props.autoLocation) {
			this.getUserLocation();
		}
		props.setQueryListener(props.componentId, props.onQueryChange, null);
	}

	componentWillMount() {
		this.props.addComponent(this.props.componentId);
		this.props.addComponent(this.internalComponent);

		this.setReact(this.props);

		if (this.props.selectedValue) {
			this.setState({
				currentLocation: this.props.selectedValue.location,
			});
			this.getCoordinates(this.props.selectedValue.location, () => {
				const selected = this.props.data.find(item => (
					item.label === this.props.selectedValue.label
				));
				this.setDistance(selected.distance);
			});
		} else if (this.props.defaultSelected) {
			this.setState({
				currentLocation: this.props.defaultSelected.location,
			});
			this.getCoordinates(this.props.defaultSelected.location, () => {
				const selected = this.props.data.find(item => (
					item.label === this.props.defaultSelected.label
				));
				this.setDistance(selected.distance);
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

		if (nextProps.locationField && Array.isArray(nextProps.suggestions)) {
			checkPropChange(this.props.suggestions, nextProps.suggestions, () => {
				this.setState({
					suggestions: this.onSuggestions(nextProps.suggestions),
				});
			});
		}

		if (
			nextProps.defaultSelected
			&& nextProps.defaultSelected.label
			&& nextProps.defaultSelected.location
			&& !isEqual(this.props.defaultSelected, nextProps.defaultSelected)
		) {
			this.setValues(nextProps.defaultSelected, nextProps);
		} else if (
			nextProps.selectedValue
			&& nextProps.selectedValue.label
			&& nextProps.selectedValue.location
			&& !isEqual(this.state.currentLocation, nextProps.selectedValue.location)
		) {
			this.setValues(nextProps.selectedValue, nextProps);
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
		this.props.removeComponent(this.internalComponent);
	}

	static suggestionsQuery = (value, props) => {
		let finalQuery = null;
		let fields;

		if (value) {
			if (Array.isArray(props.locationField)) {
				fields = props.locationField;
			} else {
				fields = [props.locationField];
			}
			finalQuery = {
				bool: {
					should: GeoDistanceDropdown.shouldQuery(value, fields, props),
					minimum_should_match: '1',
				},
			};
		}

		if (value === '') {
			finalQuery = {
				match_all: {},
			};
		}

		return finalQuery;
	};

	static shouldQuery = (value, locationFields, props) => {
		const fields = locationFields.map((field, index) =>
			`${field}${
				Array.isArray(props.fieldWeights) && props.fieldWeights[index]
					? `^${props.fieldWeights[index]}`
					: ''
			}`);

		if (props.queryFormat === 'and') {
			return [
				{
					multi_match: {
						query: value,
						fields,
						type: 'cross_fields',
						operator: 'and',
					},
				},
				{
					multi_match: {
						query: value,
						fields,
						type: 'phrase_prefix',
						operator: 'and',
					},
				},
			];
		}

		return [
			{
				multi_match: {
					query: value,
					fields,
					type: 'best_fields',
					operator: 'or',
					fuzziness: props.fuzziness ? props.fuzziness : 0,
				},
			},
			{
				multi_match: {
					query: value,
					fields,
					type: 'phrase_prefix',
					operator: 'or',
				},
			},
		];
	};

	onSuggestions = (results) => {
		const fields = Array.isArray(this.props.locationField)
			? this.props.locationField : [this.props.locationField];

		return getSuggestions(
			fields,
			results,
			this.state.currentLocation.toLowerCase(),
			[this.props.dataField],
		);
	};

	setReact = (props) => {
		const { react } = props;
		if (react) {
			const newReact = pushToAndClause(react, this.internalComponent);
			props.watchComponent(props.componentId, newReact);
		} else {
			props.watchComponent(props.componentId, { and: this.internalComponent });
		}
	};

	setValues = (selected, props) => {
		this.setState({
			currentLocation: selected.location,
		});
		this.getCoordinates(selected.location, () => {
			const selectedDistance = props.data.find(item => (
				item.label === selected.label
			));
			this.setDistance(selectedDistance.distance);
		});
	}

	static defaultQuery = (coordinates, distance, props) => {
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

	getCoordinates(selectedValue, cb) {
		// check if selectedValue contains dataField geo-points
		if (selectedValue[this.props.dataField]) {
			const { lat, lon: lng } = selectedValue[this.props.dataField];
			this.coordinates = `${lat}, ${lng}`;
			if (cb) cb();
		} else {
			// check if selectedValue contains `value` (passed from suggestions)
			// else use selectedValue directly (passed with `location` value)
			const addressValue = selectedValue.value ? selectedValue.value : selectedValue;
			fetch(`https://maps.googleapis.com/maps/api/geocode/json?key=${this.props.mapKey}&v=3.31&address=${addressValue}`)
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
			this.setState({
				currentLocation: currentValue.value,
				isOpen: false,
			}, () => {
				this.getCoordinates(currentValue, () => {
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
			});
		};

		checkValueChange(
			props.componentId,
			{ label: this.getSelectedLabel(this.state.currentDistance), location: currentValue.value },
			props.beforeValueChange,
			performUpdate,
		);
	};

	setDistance = (currentDistance) => {
		this.setState({
			currentDistance,
		}, () => {
			this.updateQuery(currentDistance, this.props);
		});
	};

	updateQuery = (distance, props = this.props) => {
		const query = props.customQuery || GeoDistanceDropdown.defaultQuery;
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
		this.setDistance(value.distance);
	}

	onInputChange = (e) => {
		const { value } = e.target;
		this.setState({
			currentLocation: value,
		});
		if (value.trim()) {
			if (this.props.locationField) {
				this.props.updateQuery({
					componentId: this.internalComponent,
					query: GeoDistanceDropdown.suggestionsQuery(value, this.props),
					value,
				});
			} else {
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
			}
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

	render() {
		return (
			<Container style={this.props.style} className={this.props.className}>
				{this.props.title && <Title className={getClassName(this.props.innerClass, 'title') || null}>{this.props.title}</Title>}
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
	suggestions: types.suggestions,
	themePreset: types.themePreset,
	updateQuery: types.funcRequired,
	watchComponent: types.funcRequired,
	// component props
	autoLocation: types.bool,
	beforeValueChange: types.func,
	className: types.string,
	componentId: types.stringRequired,
	customQuery: types.func,
	data: types.data,
	dataField: types.stringRequired,
	defaultSelected: types.selectedValue,
	filterLabel: types.string,
	fuzziness: types.fuzziness,
	icon: types.children,
	iconPosition: types.iconPosition,
	innerClass: types.style,
	innerRef: types.func,
	locationField: types.stringOrArray,
	onBlur: types.func,
	onFocus: types.func,
	onKeyDown: types.func,
	onKeyPress: types.func,
	onKeyUp: types.func,
	onQueryChange: types.func,
	onValueChange: types.func,
	placeholder: types.string,
	queryFormat: types.queryFormatSearch,
	react: types.react,
	showFilter: types.bool,
	showIcon: types.bool,
	style: types.style,
	theme: types.style,
	title: types.title,
	unit: types.string,
	URLParams: types.bool,
};

GeoDistanceDropdown.defaultProps = {
	autoLocation: true,
	className: null,
	placeholder: 'Select a value',
	showFilter: true,
	style: {},
	URLParams: false,
};

const mapStateToProps = (state, props) => ({
	mapKey: state.config.mapKey,
	selectedValue: (
		state.selectedValues[props.componentId]
		&& state.selectedValues[props.componentId].value
	) || null,
	suggestions: (state.hits[props.componentId] && state.hits[props.componentId].hits) || [],
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
