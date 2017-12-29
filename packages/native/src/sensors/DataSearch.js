import React, { Component } from 'react';
import { View, Modal, TouchableWithoutFeedback } from 'react-native';
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
	isEqual,
	debounce,
	pushToAndClause,
	checkValueChange,
	checkSomePropChange,
	checkPropChange,
} from '@appbaseio/reactivecore/lib/utils/helper';

import types from '@appbaseio/reactivecore/lib/utils/types';

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
			this.props.setQueryOptions(this.props.componentId, queryOptions);
		}
		this.setReact(this.props);

		if (this.props.defaultSelected) {
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
				this.props.setQueryOptions(nextProps.componentId, queryOptions);
			},
		);

		checkPropChange(
			this.props.react,
			nextProps.react,
			() => this.setReact(nextProps),
		);

		if (Array.isArray(nextProps.suggestions) && this.state.currentValue.trim().length) {
			checkPropChange(
				this.props.suggestions,
				nextProps.suggestions,
				() => {
					this.setState({
						suggestions: nextProps.suggestions,
					});
				},
			);
		}

		checkPropChange(
			this.props.defaultSelected,
			nextProps.defaultSelected,
			() => this.setValue(nextProps.defaultSelected, true, nextProps),
		);

		checkSomePropChange(
			this.props,
			nextProps,
			['fieldWeights', 'fuzziness', 'queryFormat'],
			() => {
				this.updateQuery(nextProps.componentId, this.state.currentValue, nextProps);
			},
		);
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
	}

	defaultQuery = (value, props) => {
		let finalQuery = null,
			fields;
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
	}

	shouldQuery(value, dataFields, props) {
		const fields = dataFields.map((field, index) => `${field}${(Array.isArray(props.fieldWeights) && props.fieldWeights[index]) ? (`^${props.fieldWeights[index]}`) : ''}`);

		if (props.queryFormat === 'and') {
			return [
				{
					multi_match: {
						query: value,
						fields,
						type: 'cross_fields',
						operator: 'and',
						fuzziness: props.fuzziness ? props.fuzziness : 0,
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
	}

	setValue = (value, isDefaultValue = false, props = this.props) => {
		const performUpdate = () => {
			this.setState({
				currentValue: value,
			});
			if (isDefaultValue) {
				if (props.autoSuggest) {
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
		if (this.props.autoSuggest) {
			this.updateQuery(this.internalComponent, value, this.props);
		} else {
			this.updateQuery(this.props.componentId, value, this.props);
		}
	}, 300);

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
			suggestions = this.props.suggestions;
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

	updateQuery = (component, value, props) => {
		const query = props.customQuery || this.defaultQuery;
		let callback = null;
		if (component === props.componentId && props.onQueryChange) {
			callback = props.onQueryChange;
		}
		props.updateQuery(component, query(value, props), value, props.filterLabel, callback);
	};

	renderSuggestions() {
		if (this.props.autoSuggest && Array.isArray(this.state.suggestions)) {
			return (<List
				dataArray={this.state.suggestions}
				keyboardShouldPersistTaps="always"
				renderRow={item =>
					(<ListItem
						onPress={() => this.selectSuggestion(item._source.name)}
					>
						<Text>{item._source.name}</Text>
      </ListItem>)
				}
			/>);
		}

		return null;
	}

	renderDataSearch = () => {
		if (this.state.showModal) {
			return (<Modal
				supportedOrientations={this.props.supportedOrientations || null}
				transparent={false}
				visible={this.state.showModal}
				onRequestClose={this.toggleModal}
			>
				<Header>
					<Left>
						<Button transparent onPress={this.toggleModal}>
							<Icon name="arrow-back" />
						</Button>
					</Left>
					{
						this.state.currentValue
							? (<Right>
								<Button
									style={{ paddingRight: 0 }}
									transparent
									onPress={() => this.selectSuggestion('')}
								>
									<Text>Reset</Text>
								</Button>
							</Right>)
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
			</Modal>);
		}

		return (<Item regular style={{ marginLeft: 0 }}>
			<TouchableWithoutFeedback
				onPress={this.toggleModal}
			>
				<Text
					style={{
						flex: 1,
						alignItems: 'center',
						color: this.state.currentValue && this.state.currentValue !== '' ? '#000' : '#555',
						flex: 1,
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
		</Item>);
	}

	render() {
		return (
			<View>
				{
					this.props.autoSuggest
						? this.renderDataSearch()
						: <Item regular style={{ marginLeft: 0 }}>
							<Input
								placeholder={this.props.placeholder}
								onChangeText={this.setValue}
								value={this.state.currentValue}
							/>
						</Item>
				}
			</View>
		);
	}
}

DataSearch.propTypes = {
	componentId: types.componentId,
	addComponent: types.addComponent,
	highlight: types.highlight,
	setQueryOptions: types.setQueryOptions,
	defaultSelected: types.string,
	dataField: types.dataFieldArray,
	highlightField: types.highlightField,
	react: types.react,
	suggestions: types.suggestions,
	removeComponent: types.removeComponent,
	fieldWeights: types.fieldWeights,
	queryFormat: types.queryFormatSearch,
	fuzziness: types.fuzziness,
	autoSuggest: types.autoSuggest,
	beforeValueChange: types.beforeValueChange,
	onValueChange: types.beforeValueChange,
	customQuery: types.customQuery,
	onQueryChange: types.onQueryChange,
	updateQuery: types.updateQuery,
	supportedOrientations: types.supportedOrientations,
	placeholder: types.placeholder,
	filterLabel: types.filterLabel,
};

DataSearch.defaultProps = {
	placeholder: 'Search',
	autoSuggest: true,
	queryFormat: 'or',
};

const mapStateToProps = (state, props) => ({
	suggestions: state.hits[props.componentId] && state.hits[props.componentId].hits,
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	updateQuery: (component, query, value, filterLabel, onQueryChange) => dispatch(updateQuery(component, query, value, filterLabel, onQueryChange)),
	setQueryOptions: (component, props) => dispatch(setQueryOptions(component, props)),
});

export default connect(mapStateToProps, mapDispatchtoProps)(DataSearch);
