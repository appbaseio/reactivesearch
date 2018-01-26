import React, { Component } from 'react';
import { Platform, View, Modal, TouchableWithoutFeedback } from 'react-native';
import {
	Input,
	Item,
	List,
	ListItem,
	Text,
	Button,
	Header,
	Left,
	Right,
	Icon,
} from 'native-base';
import { connect } from 'react-redux';

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryOptions,
} from '@appbaseio/reactivecore/lib/actions';
import {
	debounce,
	pushToAndClause,
	checkValueChange,
	checkPropChange,
	checkSomePropChange,
} from '@appbaseio/reactivecore/lib/utils/helper';

import types from '@appbaseio/reactivecore/lib/utils/types';
import getSuggestions from '@appbaseio/reactivecore/lib/utils/suggestions';

class DataSearch extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentValue: '',
			suggestions: [],
			showModal: false,
		};
		this.internalComponent = `${this.props.componentId}__internal`;
	}

	componentDidMount() {
		this.props.addComponent(this.props.componentId);
		this.props.addComponent(this.internalComponent);

		if (this.props.highlight) {
			const queryOptions = this.highlightQuery(this.props);
			queryOptions.size = 20;
			this.props.setQueryOptions(this.props.componentId, queryOptions);
		} else {
			this.props.setQueryOptions(this.props.componentId, {
				size: 20,
			});
		}
		this.setReact(this.props);

		if (this.props.selectedValue) {
			this.setValue(this.props.selectedValue, true);
		} else if (this.props.defaultSelected) {
			this.setValue(this.props.defaultSelected, true);
		}
	}

	componentWillReceiveProps(nextProps) {
		checkSomePropChange(
			this.props,
			nextProps,
			['highlight', 'dataField', 'highlightField'],
			() => {
				const queryOptions = this.highlightQuery(nextProps);
				queryOptions.size = 20;
				this.props.setQueryOptions(nextProps.componentId, queryOptions);
			},
		);

		checkPropChange(
			this.props.react,
			nextProps.react,
			() => this.setReact(nextProps),
		);

		if (Array.isArray(nextProps.suggestions) && this.state.currentValue.trim().length) {
			// shallow check allows us to set suggestions even if the next set
			// of suggestions are same as the current one
			if (this.props.suggestions !== nextProps.suggestions) {
				this.setState({
					suggestions: this.onSuggestions(nextProps.suggestions),
				});
			}
		}

		checkSomePropChange(
			this.props,
			nextProps,
			['fieldWeights', 'fuzziness', 'queryFormat', 'dataField'],
			() => {
				this.updateQuery(nextProps.componentId, this.state.currentValue, nextProps);
			},
		);

		if (this.props.defaultSelected !== nextProps.defaultSelected) {
			this.setValue(nextProps.defaultSelected, true, nextProps);
		} else if (this.props.selectedValue !== nextProps.selectedValue) {
			this.setValue(nextProps.selectedValue || '', true, nextProps);
		}
	}

	componentWillUnmount() {
		this.props.removeComponent(this.props.componentId);
		this.props.removeComponent(this.internalComponent);
	}

	setReact = (props) => {
		const { react } = props;
		if (react) {
			const newReact = pushToAndClause(react, this.internalComponent);
			props.watchComponent(props.componentId, newReact);
		} else {
			props.watchComponent(props.componentId, { and: this.internalComponent });
		}
	}

	highlightQuery = (props) => {
		if (!props.highlight) {
			return null;
		}
		const fields = {};
		const highlightField = props.highlightField ? props.highlightField : props.dataField;

		if (typeof highlightField === 'string') {
			fields[highlightField] = {};
		} else if (Array.isArray(highlightField)) {
			highlightField.forEach((item) => {
				fields[item] = {};
			});
		}

		return {
			highlight: {
				pre_tags: ['<em>'],
				post_tags: ['</em>'],
				fields,
			},
		};
	};

	defaultQuery = (value, props) => {
		let finalQuery = null;
		let fields;

		if (value) {
			if (Array.isArray(props.dataField)) {
				fields = props.dataField;
			} else {
				fields = [props.dataField];
			}
			finalQuery = {
				bool: {
					should: this.shouldQuery(value, fields, props),
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

	shouldQuery = (value, dataFields, props) => {
		const fields = dataFields.map((field, index) =>
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
		const fields = Array.isArray(this.props.dataField)
			? this.props.dataField : [this.props.dataField];

		return getSuggestions(
			fields,
			results,
			this.state.currentValue.toLowerCase(),
		);
	};

	setValue = (value, isDefaultValue = false, props = this.props) => {
		const performUpdate = () => {
			this.setState({
				currentValue: value,
			});
			if (isDefaultValue) {
				if (props.autosuggest) {
					this.updateQuery(this.internalComponent, value, props);
				}
				this.updateQuery(props.componentId, value, props);
			} else {
				// debounce for handling text while typing
				this.handleTextChange(value);
			}
		};
		checkValueChange(
			props.componentId,
			value,
			props.beforeValueChange,
			props.onValueChange,
			performUpdate,
		);
	};

	handleTextChange = debounce((value) => {
		if (this.props.autosuggest) {
			this.updateQuery(this.internalComponent, value, this.props);
		} else {
			this.updateQuery(this.props.componentId, value, this.props);
		}
	}, this.props.debounce);

	selectSuggestion = (value) => {
		this.setState({
			suggestions: [],
		});
		this.setValue(value, true);
		this.toggleModal();
	};

	setSuggestions = () => {
		let suggestions = [];
		if (this.state.currentValue.trim() !== '') {
			suggestions = this.onSuggestions(this.props.suggestions);
		}

		this.setState({
			suggestions,
		});
	};

	toggleModal = () => {
		this.setState({
			showModal: !this.state.showModal,
		});
	};

	updateQuery = (componentId, value, props) => {
		const query = props.customQuery || this.defaultQuery;
		let onQueryChange = null;
		if (componentId === props.componentId && props.onQueryChange) {
			onQueryChange = props.onQueryChange;
		}
		props.updateQuery({
			componentId,
			query: query(value, props),
			value,
			label: props.filterLabel,
			showFilter: props.showFilter,
			onQueryChange,
			URLParams: false,
		});
	};

	renderSuggestions() {
		let suggestionsList = [];

		if (
			!this.state.currentValue
			&& this.props.defaultSuggestions
			&& this.props.defaultSuggestions.length
		) {
			suggestionsList = this.props.defaultSuggestions;
		} else if (this.state.currentValue) {
			suggestionsList = this.state.suggestions;
		}

		return (
			<List
				dataArray={suggestionsList}
				keyboardShouldPersistTaps="always"
				renderRow={item => (
					<ListItem onPress={() => this.selectSuggestion(item.label)}>
						<Text>{item.label}</Text>
					</ListItem>
				)}
			/>
		);
	}

	renderDataSearch = () => {
		if (this.state.showModal) {
			return (
				<Modal
					supportedOrientations={this.props.supportedOrientations || null}
					transparent={false}
					visible={this.state.showModal}
					onRequestClose={this.toggleModal}
				>
					<Header>
						<Left>
							<Button transparent onPress={this.toggleModal}>
								<Icon
									name="arrow-back"
									style={{
										...Platform.select({
											android: {
												color: '#fff',
											},
										}),
									}}
								/>
							</Button>
						</Left>
						{
							this.state.currentValue
								? (
									<Right>
										<Button
											style={{ paddingRight: 0 }}
											transparent
											onPress={() => this.selectSuggestion('')}
										>
											<Text
												style={{
													...Platform.select({
														android: {
															color: '#fff',
														},
													}),
												}}
											>
												Reset
											</Text>
										</Button>
									</Right>
								)
								: null
						}
					</Header>
					<Item regular style={{ marginLeft: 10, margin: 10 }}>
						<Input
							returnKeyType="search"
							onSubmitEditing={e => this.selectSuggestion(e.nativeEvent.text)}
							placeholder={this.props.placeholder}
							onChangeText={this.setValue}
							value={this.state.currentValue}
							onFocus={this.setSuggestions}
							autoFocus
						/>
					</Item>
					{this.renderSuggestions()}
				</Modal>
			);
		}

		return (
			<Item regular style={{ marginLeft: 0 }}>
				<TouchableWithoutFeedback
					onPress={this.toggleModal}
				>
					<Text
						style={{
							flex: 1,
							alignItems: 'center',
							color: (this.state.currentValue
								&& this.state.currentValue !== '') ? '#000' : '#555',
							fontSize: 17,
							height: 50,
							lineHeight: 24,
							paddingLeft: 8,
							paddingRight: 5,
							paddingTop: 12,
						}}
					>
						{
							this.state.currentValue && this.state.currentValue !== ''
								? this.state.currentValue
								: this.props.placeholder
						}
					</Text>
				</TouchableWithoutFeedback>
			</Item>
		);
	}

	render() {
		return (
			<View style={this.props.style}>
				{
					this.props.autosuggest
						? this.renderDataSearch()
						: (
							<Item regular style={{ marginLeft: 0 }}>
								<Input
									placeholder={this.props.placeholder}
									onChangeText={this.setValue}
									value={this.state.currentValue}
									autoFocus={this.props.autoFocus}
								/>
							</Item>
						)
				}
			</View>
		);
	}
}

DataSearch.propTypes = {
	componentId: types.stringRequired,
	addComponent: types.funcRequired,
	highlight: types.bool,
	setQueryOptions: types.funcRequired,
	defaultSelected: types.string,
	dataField: types.dataFieldArray,
	highlightField: types.highlightField,
	react: types.react,
	suggestions: types.suggestions,
	defaultSuggestions: types.suggestions,
	removeComponent: types.funcRequired,
	fieldWeights: types.fieldWeights,
	queryFormat: types.queryFormatSearch,
	fuzziness: types.fuzziness,
	autosuggest: types.bool,
	beforeValueChange: types.func,
	onValueChange: types.func,
	customQuery: types.func,
	onQueryChange: types.func,
	updateQuery: types.funcRequired,
	placeholder: types.string,
	selectedValue: types.selectedValue,
	showFilter: types.bool,
	filterLabel: types.string,
	style: types.style,
	debounce: types.number,
	supportedOrientations: types.supportedOrientations,
	autoFocus: types.bool,
};

DataSearch.defaultProps = {
	placeholder: 'Search',
	autoFocus: false,
	autosuggest: true,
	queryFormat: 'or',
	showFilter: true,
	style: {},
	debounce: 0,
};

const mapStateToProps = (state, props) => ({
	suggestions: state.hits[props.componentId] && state.hits[props.componentId].hits,
	selectedValue: (state.selectedValues[props.componentId]
		&& state.selectedValues[props.componentId].value) || null,
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	setQueryOptions: (component, props) => dispatch(setQueryOptions(component, props)),
});

export default connect(mapStateToProps, mapDispatchtoProps)(DataSearch);
