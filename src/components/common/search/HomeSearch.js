import React from 'react';
import Link from 'gatsby-link';
import * as JsSearch from 'js-search';
import Autosuggest from 'react-autosuggest';
import data from '../../../data/search.index.json';
import { Spirit } from '../../../styles/spirit-styles';
import Icon from '../Icon.js';

const search = new JsSearch.Search('url');
search.tokenizer = new JsSearch.StopWordsTokenizer(new JsSearch.SimpleTokenizer());

search.addIndex('title');
search.addIndex('heading');
search.addIndex('tokens');
search.addDocuments(data);

const getSuggestions = value => {
	const inputValue = value.trim().toLowerCase();
	const inputLength = inputValue.length;
	let topResults = search.search(inputValue).slice(0, 8);
	const exactMatchIndex = topResults.findIndex(
		item => item.title.toLowerCase() === inputValue && !item.heading.length,
	);
	if (exactMatchIndex > 0) {
		topResults = [
			topResults[exactMatchIndex],
			...topResults.slice(0, exactMatchIndex),
			...topResults.slice(exactMatchIndex + 1),
		];
	}
	return inputLength === 0 ? [] : topResults;
};

const HitTemplate = ({ hit }) => (
	<Link to={hit.url} className="tdn db pt3 pb3 blue search-result pl5 pr5 br3 br--left">
		<h4 className={`${Spirit.h5} dib`}>{hit.title}</h4>
		<p
			className={`${Spirit.small} midgrey nudge-bottom--2`}
			dangerouslySetInnerHTML={{ __html: hit.heading }}
		/>
	</Link>
);

class AutoComplete extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			value: '',
			hits: [],
		};

		this.onChange = this.onChange.bind(this);
		this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
		this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
		this.renderSuggestion = this.renderSuggestion.bind(this);
	}

	onChange(event, { newValue }) {
		this.setState(() => {
			return { value: newValue };
		});
	}

	onSuggestionsFetchRequested({ value }) {
		const suggestions = getSuggestions(value);
		this.setState({
			hits: suggestions,
		});
	}

	onSuggestionsClearRequested() {
		this.setState({
			hits: [],
		});
	}

	renderSuggestion(hit) {
		return <HitTemplate hit={hit} />;
	}

	render() {
		// Don't show sections with no results
		const { hits, value } = this.state;

		const inputProps = {
			placeholder: `Search documentation...`,
			onChange: this.onChange,
			value,
			autoFocus: true,
			'data-cy': `search-input`,
		};

		const inputTheme = `input-reset form-text b--transparent search-modal-field-bg br-pill flex-auto whitney lh-normal pa2 pl8 plr3 w-100 dark-placeholder`;

		const theme = {
			input: `${inputTheme} home-input`,
			inputOpen: inputTheme,
			inputFocused: inputTheme,
			suggestionsContainerOpen: `fixed home-search`,
			suggestionsList: `list pa0 ma0 pt1 flex-auto`,
			sectionContainer: `pb4 mb4`,
			sectionTitle: `f8 lh-h4 fw5 midgrey w30 tr mt2 sticky top-2 pr2`,
		};

		return (
			<>
				<Icon name="search" className=" w3 h-auto absolute top-3 right-3 left-3-l" />
				<Autosuggest
					suggestions={hits}
					onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
					onSuggestionsClearRequested={this.onSuggestionsClearRequested}
					getSuggestionValue={this.getSuggestionValue}
					renderSuggestion={this.renderSuggestion}
					inputProps={inputProps}
					theme={theme}
				/>
			</>
		);
	}
}

export default AutoComplete;
