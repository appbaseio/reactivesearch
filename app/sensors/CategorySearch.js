/* eslint max-lines: 0 */
import React, { Component } from "react";
import classNames from "classnames";
import Select from "react-select";
import {
	TYPES,
	AppbaseChannelManager as manager,
	AppbaseSensorHelper as helper
} from "@appbaseio/reactivemaps";

export default class CategorySearch extends Component {
	constructor(props) {
		super(props);
		this.state = {
			items: [],
			currentValue: null,
			isLoading: false,
			options: [],
			rawData: {
				hits: {
					hits: []
				}
			}
		};
		this.selectedCategory = null;
		this.searchInputId = `internal-${props.componentId}`;
		this.type = "match_phrase";
		this.channelId = null;
		this.channelListener = null;
		this.fieldType = typeof props.appbaseField;
		this.handleSearch = this.handleSearch.bind(this);
		this.optionRenderer = this.optionRenderer.bind(this);
		this.setValue = this.setValue.bind(this);
		this.defaultSearchQuery = this.defaultSearchQuery.bind(this);
		this.previousSelectedSensor = {};
	}

	// Get the items from Appbase when component is mounted
	componentDidMount() {
		this.setQueryInfo();
		this.createChannel();
		this.checkDefault();
	}

	componentWillUpdate() {
		this.checkDefault();
	}

	// stop streaming request and remove listener when component will unmount
	componentWillUnmount() {
		if (this.channelId) {
			manager.stopStream(this.channelId);
		}
		if (this.channelListener) {
			this.channelListener.remove();
		}
	}

	// set the query type and input data
	setQueryInfo() {
		const obj = {
			key: this.props.componentId,
			value: {
				queryType: this.type,
				inputData: this.props.appbaseField,
				customQuery: this.props.customQuery ? this.props.customQuery : this.defaultSearchQuery
			}
		};
		helper.selectedSensor.setSensorInfo(obj);
		const searchObj = {
			key: this.searchInputId,
			value: {
				queryType: "multi_match",
				inputData: this.props.appbaseField,
				customQuery: this.defaultSearchQuery
			}
		};
		helper.selectedSensor.setSensorInfo(searchObj);
	}

	// set value to search
	setValue(value) {
		const obj = {
			key: this.searchInputId,
			value: { value }
		};
		helper.selectedSensor.set(obj, true);
		if (value && value.trim() !== "") {
			this.setState({
				options: [{
					label: value,
					value
				}],
				isLoadingOptions: true,
				currentValue: value
			});
		} else {
			this.setState({
				options: [],
				isLoadingOptions: false,
				currentValue: value
			});
		}
	}

	removeDuplicates(myArr, prop) {
		return myArr.filter((obj, pos, arr) => arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos);
	}

	// default query
	defaultSearchQuery(input) {
		if (input && input.value) {
			const query = [];
			if (this.fieldType === "string") {
				query.push({
					match_phrase_prefix: {
						[this.props.appbaseField]: input.value
					}
				});
			} else {
				this.props.appbaseField.forEach((field) => {
					query.push({
						match_phrase_prefix: {
							[field]: input.value
						}
					});
				});
			}

			if (input.category && input.category !== null) {
				return {
					bool: {
						must: [query, {
							term: {
								[this.props.categoryField]: input.category
							}
						}]
					}
				};
			}

			return {
				bool: {
					should: query,
					minimum_should_match: 1
				}
			};
		}
		return null;
	}

	// Create a channel which passes the react and receive results whenever react changes
	createChannel() {
		const react = this.props.react ? this.props.react : {};
		react.aggs = {
			key: this.props.categoryField
		};
		if (react && react.and && typeof react.and === "string") {
			react.and = [react.and];
		} else {
			react.and = react.and ? react.and : [];
		}
		react.and.push(this.searchInputId);
		const channelObj = manager.create(this.context.appbaseRef, this.context.type, react);
		this.channelId = channelObj.channelId;
		this.channelListener = channelObj.emitter.addListener(channelObj.channelId, (res) => {
			const data = res.data;
			let rawData;
			if (res.mode === "streaming") {
				rawData = this.state.rawData;
				rawData.hits.hits.push(res.data);
			} else if (res.mode === "historic") {
				rawData = data;
			}
			this.setState({
				rawData
			});
			this.setData(rawData, res.appliedQuery.body.query);
		});
		this.listenLoadingChannel(channelObj);
	}

	listenLoadingChannel(channelObj) {
		this.loadListener = channelObj.emitter.addListener(`${channelObj.channelId}-query`, (res) => {
			if (res.appliedQuery) {
				this.setState({
					queryStart: res.queryState
				});
			}
		});
	}

	setData(data, loadSuggestions) {
		let aggs = [];
		let options = [];
		let searchField = null;
		if (data.aggregations && data.aggregations[this.props.categoryField] && data.aggregations[this.props.categoryField].buckets) {
			aggs = (data.aggregations[this.props.categoryField].buckets).slice(0, 2);
		}

		if (loadSuggestions) {
			if (this.fieldType === "string") {
				searchField = `hit._source.${this.props.appbaseField}.trim()`;
			}
			data.hits.hits.forEach((hit) => {
				if (searchField) {
					options.push({ value: eval(searchField), label: eval(searchField) });
				} else if (this.fieldType === "object") {
					this.props.appbaseField.forEach((field) => {
						const tempField = `hit._source.${field}`;
						if (eval(tempField)) {
							options.push({ value: eval(tempField), label: eval(tempField) });
						}
					});
				}
			});
			if (this.state.currentValue && this.state.currentValue.trim() !== "" && aggs.length) {
				const suggestions = [
					{
						label: this.state.currentValue,
						markup: `${this.state.currentValue} &nbsp;<span class="rbc-strong">in All Categories</span>`,
						value: this.state.currentValue
					},
					{
						label: this.state.currentValue,
						markup: `${this.state.currentValue} &nbsp;<span class="rbc-strong">in ${aggs[0].key}</span>`,
						value: `${this.state.currentValue}--rbc1`,
						category: aggs[0].key
					},
					{
						label: this.state.currentValue,
						markup: `${this.state.currentValue} &nbsp;<span class="rbc-strong">in ${aggs[1].key}</span>`,
						value: `${this.state.currentValue}--rbc2`,
						category: aggs[1].key
					}
				];
				options.unshift(...suggestions);
			}
			options = this.removeDuplicates(options, "value");
			this.setState({
				options,
				isLoadingOptions: false
			});
		}
	}

	checkDefault() {
		if (this.props.defaultSelected && this.defaultSelected !== this.props.defaultSelected) {
			this.defaultSelected = this.props.defaultSelected;
			setTimeout(this.setValue.bind(this, this.defaultSelected), 100);
			this.handleSearch({
				value: this.defaultSelected
			});
		}
	}

	// When user has selected a search value
	handleSearch(currentValue) {
		const value = currentValue ? currentValue.value : null;
		const finalVal = { value };

		if (currentValue && currentValue.category) {
			finalVal.category = currentValue.category;
			finalVal.value = finalVal.value.slice(0, -6);
		} else {
			finalVal.category = null;
		}

		const obj = {
			key: this.props.componentId,
			value: finalVal
		};

		helper.selectedSensor.set(obj, true);
		this.setState({
			currentValue: value
		});
	}

	optionRenderer(option) {
		if (option.markup) {
			return (<div key={option.value} dangerouslySetInnerHTML={{ __html: option.markup }} />);
		}

		return (<div key={option.value}>{option.label}</div>);
	}

	render() {
		let title = null;
		if (this.props.title) {
			title = (<h4 className="rbc-title col s12 col-xs-12">{this.props.title}</h4>);
		}
		const cx = classNames({
			"rbc-title-active": this.props.title,
			"rbc-title-inactive": !this.props.title,
			"rbc-placeholder-active": this.props.placeholder,
			"rbc-placeholder-inactive": !this.props.placeholder
		});

		return (
			<div className={`rbc rbc-categorysearch col s12 col-xs-12 card thumbnail ${cx}`}>
				{title}
				<Select
					isLoading={this.state.isLoadingOptions}
					value={this.state.currentValue}
					options={this.state.options}
					onInputChange={this.setValue}
					optionRenderer={this.optionRenderer}
					onChange={this.handleSearch}
					onBlurResetsInput={false}
					{...this.props}
				/>
			</div>
		);
	}
}

CategorySearch.propTypes = {
	componentId: React.PropTypes.string.isRequired,
	appbaseField: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.arrayOf(React.PropTypes.string)
	]),
	title: React.PropTypes.string,
	categoryField: React.PropTypes.string,
	placeholder: React.PropTypes.string,
	defaultSelected: React.PropTypes.string,
	customQuery: React.PropTypes.func,
	react: React.PropTypes.object
};

// Default props value
CategorySearch.defaultProps = {
	placeholder: "Search"
};

// context type
CategorySearch.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};

CategorySearch.types = {
	componentId: TYPES.STRING,
	appbaseField: TYPES.STRING,
	react: TYPES.OBJECT,
	title: TYPES.STRING,
	categoryField: TYPES.STRING,
	placeholder: TYPES.STRING,
	defaultSelected: TYPES.STRING,
	customQuery: TYPES.FUNCTION
};
