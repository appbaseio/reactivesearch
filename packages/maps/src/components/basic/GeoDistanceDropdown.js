/** @jsx jsx */
import { jsx } from '@emotion/core';

import Downshift from 'downshift';
import { withTheme } from 'emotion-theming';

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryListener,
	setQueryOptions,
	setCustomQuery,
	setDefaultQuery,
	setComponentProps,
	updateComponentProps,
} from '@appbaseio/reactivecore/lib/actions';
import {
	isEqual,
	checkValueChange,
	checkSomePropChange,
	checkPropChange,
	getClassName,
	getOptionsFromQuery,
	updateCustomQuery,
	updateDefaultQuery,
	getComponent,
	hasCustomRenderer,
} from '@appbaseio/reactivecore/lib/utils/helper';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';
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
import { connect, getValidPropsKeys } from '@appbaseio/reactivesearch/lib/utils';
import GeoCode from './GeoCode';
import { hasGoogleMap } from '../utils';
import ScriptLoader from '../result/addons/components/ScriptLoader';

class GeoDistanceDropdown extends GeoCode {
	constructor(props) {
		super(props);

		this.type = 'geo_distance';
		this.coordinates = null;
		this.autocompleteService = null;

		if (props.geocoder) {
			this.geocoder = props.geocoder;
		} else if (hasGoogleMap()) {
			this.geocoder = new window.google.maps.Geocoder();
		}

		if (props.autoLocation) {
			this.getUserLocation();
		}

		let currentLocation = null;
		let currentDistance = 0;

		props.addComponent(props.componentId);
		props.setQueryListener(props.componentId, props.onQueryChange, null);

		// Update props in store
		props.setComponentProps(props.componentId, props, componentTypes.geoDistanceDropdown);
		props.setComponentProps(this.internalComponent, props, componentTypes.geoDistanceDropdown);

		this.setReact(props);

		if (props.value) {
			currentLocation = props.value.location;
			const selected = props.data.find(item => item.label === props.value.label);

			currentDistance = selected.distance;
		} else if (props.selectedValue) {
			currentLocation = props.selectedValue.location;
			const selected = props.data.find(item => item.label === props.selectedValue.label);

			currentDistance = selected.distance;
		} else if (props.defaultValue) {
			currentLocation = props.defaultValue.location;
			const selected = props.data.find(item => item.label === props.defaultValue.label);
			currentDistance = selected.distance;
		}

		this.state = {
			currentLocation,
			currentDistance,
			userLocation: null,
			suggestions: [],
			isOpen: false,
		};

		const value = {
			coordinates: this.coordinates,
			distance: currentDistance,
		};
		// Set custom and default queries in store
		updateCustomQuery(props.componentId, props, value);
		updateDefaultQuery(props.componentId, props, value);

		this.getCoordinates(currentLocation, () => {
			this.setDistance(currentDistance);
		});
	}

	componentDidMount() {
		if (hasGoogleMap()) {
			this.autocompleteService = new window.google.maps.places.AutocompleteService();
		}
	}

	componentDidUpdate(prevProps) {
		if (this.props.onData) {
			checkSomePropChange(this.props, prevProps, ['error', 'selectedValue'], () => {
				this.props.onData({
					value: this.props.selectedValue,
					error: this.props.error,
				});
			});
		}
		checkSomePropChange(this.props, prevProps, getValidPropsKeys(this.props), () => {
			this.props.updateComponentProps(
				this.props.componentId,
				this.props,
				componentTypes.geoDistanceDropdown,
			);
			this.props.updateComponentProps(
				this.internalComponent,
				this.props,
				componentTypes.geoDistanceDropdown,
			);
		});

		checkPropChange(this.props.react, prevProps.react, () => this.setReact(this.props));

		checkSomePropChange(this.props, prevProps, ['dataField', 'nestedField'], () => {
			this.updateQuery(this.state.currentDistance, this.props);
		});

		if (this.props.value && !isEqual(this.props.value, prevProps.value)) {
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

	getSelectedLabel = distance => this.props.data.find(item => item.distance === distance);

	setLocation = (currentValue, props = this.props) => {
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
		const {
			componentId, customQuery, filterLabel, showFilter, URLParams,
		} = props;
		const selectedDistance = this.getSelectedLabel(distance);
		let value = null;
		if (selectedDistance) {
			value = {
				label: selectedDistance.label,
				location: this.state.currentLocation,
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
			meta: {
				coordinates: this.coordinates,
				distance,
			},
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
		if (value.trim() && hasGoogleMap()) {
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
					getRootProps,
					getInputProps,
					getItemProps,
					isOpen,
					highlightedIndex,
				}) => (
					<div
						{...getRootProps({ css: suggestionsContainer }, { suppressRefError: true })}
					>
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
								css={suggestions(themePreset, theme)}
								className={getClassName(this.props.innerClass, 'list')}
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

	getComponent = (items, downshiftProps) => {
		const {
			error, isLoading, selectedValue, rawData,
		} = this.props;
		const data = {
			error,
			loading: isLoading,
			value: selectedValue,
			data: items || [],
			rawData,
			handleChange: this.onDistanceChange,
			downshiftProps,
		};
		return getComponent(data, this.props);
	};
	get hasCustomRenderer() {
		return hasCustomRenderer(this.props);
	}
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
					renderItem={
						typeof this.props.renderItem === 'function'
							? value =>
								this.props.renderItem(
									value,
									this.getSelectedLabel(this.state.currentDistance)
										? this.getSelectedLabel(this.state.currentDistance)
											.label === value
										: false,
								)
							: undefined
					}
					onChange={this.onDistanceChange}
					selectedItem={this.getSelectedLabel(this.state.currentDistance)}
					placeholder="Select distance"
					keyField="label"
					returnsObject
					themePreset={this.props.themePreset}
					hasCustomRenderer={this.hasCustomRenderer}
					customRenderer={this.getComponent}
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
	setComponentProps: types.funcRequired,
	setCustomQuery: types.funcRequired,
	updateComponentProps: types.funcRequired,
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
	setQueryOptions: types.funcRequired,
	value: types.selectedValue,
	showFilter: types.bool,
	showIcon: types.bool,
	style: types.style,
	theme: types.style,
	title: types.title,
	unit: types.string,
	URLParams: types.bool,
	serviceOptions: types.props,
	error: types.title,
	onData: types.func,
	render: types.func,
	renderItem: types.func,
	isLoading: types.bool,
	rawData: types.rawData,
	geocoder: types.any, // eslint-disable-line
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
	isLoading: false,
};

const mapStateToProps = (state, props) => ({
	mapKey: state.config.mapKey,
	selectedValue:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].value)
		|| null,
	themePreset: state.config.themePreset,
	error: state.error[props.componentId],
	isLoading: state.isLoading[props.componentId],
	rawData: state.rawData[props.componentId],
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	setQueryListener: (component, onQueryChange, beforeQueryChange) =>
		dispatch(setQueryListener(component, onQueryChange, beforeQueryChange)),
	setQueryOptions: (component, props) => dispatch(setQueryOptions(component, props)),
	setDefaultQuery: (component, query) => dispatch(setDefaultQuery(component, query)),
	setCustomQuery: (component, query) => dispatch(setCustomQuery(component, query)),
	setComponentProps: (component, options, componentType) =>
		dispatch(setComponentProps(component, options, componentType)),
	updateComponentProps: (component, options) =>
		dispatch(updateComponentProps(component, options)),
});

const ConnectedComponent = connect(
	mapStateToProps,
	mapDispatchtoProps,
)(
	withTheme(props => (
		<ScriptLoader>
			<GeoDistanceDropdown {...props} />
		</ScriptLoader>
	)),
);

export default ConnectedComponent;
