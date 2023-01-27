import React from 'react';
import renderer from 'react-test-renderer';
import ReactiveBase from '../basic/ReactiveBase';
import SearchBox from './SearchBox';

const MOCK_HITS_DATA = [
	{
		value: 'harry potter',
		label: 'harry potter',
		url: null,
		_suggestion_type: 'recent',
		_category: null,
		_count: 216,
		_rs_score: 0,
		_matched_tokens: null,
		_id: '',
		_index: null,
		_score: 0,
		_source: {},
	},
	{
		value: 'complete night harry potter film wizardry boxed set',
		label: 'complete night harry potter film wizardry boxed set',
		url: null,
		_suggestion_type: 'recent',
		_category: null,
		_count: 1,
		_rs_score: 0,
		_matched_tokens: null,
		_id: '',
		_index: null,
		_score: 0,
		_source: {},
	},
	{
		value: 'harry potter complete series',
		label: 'harry potter <b class="highlight">complete series</b>',
		url: null,
		_suggestion_type: 'popular',
		_category: null,
		_count: null,
		_rs_score: 2.1,
		_matched_tokens: ['harry', 'potter'],
		_id: 'Sj7tXXEBhDwVijd9m1hJ',
		_index: 'good-books-ds',
		_score: 46.806698,
		_source: {
			authors: 'J.K. Rowling',
			average_rating: 4.74,
			average_rating_rounded: 5,
			books_count: 76,
			id: 422,
			image: 'https://images.gr-assets.com/books/1392579059l/862041.jpg',
			image_medium: 'https://images.gr-assets.com/books/1392579059m/862041.jpg',
			isbn: '545044251',
			language_code: 'eng',
			original_publication_year: 1998,
			original_series: 'Harry Potter',
			original_title: 'Complete Harry Potter Boxed Set',
			ratings_count: 190050,
			title: 'Harry Potter Boxset (Harry Potter, #1-7)',
		},
	},
	{
		value: 'night harry potter film wizardry boxed set',
		label: 'night harry potter film wizardry boxed set',
		url: null,
		_suggestion_type: 'promoted',
		_category: null,
		_count: 3,
		_rs_score: 0,
		_matched_tokens: null,
		_id: '',
		_index: null,
		_score: 0,
		_source: {},
	},
	{
		value: 'harry potter film wizardry',
		label: 'harry potter <b class="highlight">film wizardry</b>',
		url: null,
		_suggestion_type: 'index',
		_category: null,
		_count: null,
		_rs_score: 2.1,
		_matched_tokens: ['harry', 'potter'],
		_id: 'yrDtXXEB2-YohfeSysnk',
		_index: 'good-books-ds',
		_score: 51.51347,
		_source: {
			authors: 'Brian Sibley',
			average_rating: 4.48,
			average_rating_rounded: 4,
			books_count: 24,
			id: 2001,
			image: 'https://images.gr-assets.com/books/1464452934l/7952502.jpg',
			image_medium: 'https://images.gr-assets.com/books/1464452934m/7952502.jpg',
			isbn: '61997811',
			language_code: 'eng',
			original_publication_year: 2010,
			original_series: '',
			original_title: 'Harry Potter: Film Wizardry',
			ratings_count: 45081,
			title: 'Harry Potter: Film Wizardry',
		},
	},
	{
		value: 'harry potter boxed set',
		label: 'harry potter <b class="highlight">boxed set</b>',
		url: null,
		_suggestion_type: 'index',
		_category: null,
		_count: null,
		_rs_score: 2.1,
		_matched_tokens: ['harry', 'potter'],
		_id: 'Sj7tXXEBhDwVijd9m1hJ',
		_index: 'good-books-ds',
		_score: 46.806698,
		_source: {
			authors: 'J.K. Rowling',
			average_rating: 4.74,
			average_rating_rounded: 5,
			books_count: 76,
			id: 422,
			image: 'https://images.gr-assets.com/books/1392579059l/862041.jpg',
			image_medium: 'https://images.gr-assets.com/books/1392579059m/862041.jpg',
			isbn: '545044251',
			language_code: 'eng',
			original_publication_year: 1998,
			original_series: 'Harry Potter',
			original_title: 'Complete Harry Potter Boxed Set',
			ratings_count: 190050,
			title: 'Harry Potter Boxset (Harry Potter, #1-7)',
		},
	},
];
const MOCK_HITS_DATA_FEATURED_SUGGESTIONS = [
	{
		value: 'home page',
		label: 'Go to <mark>Home</mark>',
		description: 'Blazing fast search with Appbase',
		url: null,
		_suggestion_type: 'featured',
		sectionId: 'navigation',
		sectionLabel: 'Navigation Links',
		action: 'navigate',
		subAction: '{"link":"/home"}',
		icon: "<img src='data:image/png;base64,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'/>",
		iconURL: null,
		_category: null,
		_count: null,
		_rs_score: 0,
		_matched_tokens: null,
		_id: '',
		_index: null,
		_score: 0,
		_source: {},
	},
	{
		value: 'SearchBox: Tutorial',
		label: 'Go to <mark>SearchBox</mark> getting started guide',
		description: 'Headless API to build search interface, easy to use and understand',
		url: null,
		_suggestion_type: 'featured',
		sectionId: 'tutorials',
		sectionLabel: 'Tutorbals 🪲',
		action: 'function',
		subAction:
			'function(currentSuggestion, value, customEvents) { console.log("function invoked", value)}',
		icon: null,
		iconURL:
			'https://camo.githubusercontent.com/95874e325a752e6ffb604991feb719c6e8bae6a552ed23d4a566bc4d518bc090/68747470733a2f2f692e696d6775722e636f6d2f696952397741732e706e67',
		_category: null,
		_count: null,
		_rs_score: 0,
		_matched_tokens: null,
		_id: '',
		_index: null,
		_score: 0,
		_source: {},
	},
	{
		value: 'chasing harry ',
		label: 'chasing harry winston',
		url: null,
		_suggestion_type: 'recent',
		_category: null,
		_count: 1,
		_rs_score: 0,
		_matched_tokens: null,
		_id: '',
		_index: null,
		_score: 0,
		_source: {},
		sectionId: 'recents',
		sectionLabel: 'Recent Suggestions',
	},
	{
		value: 'harry',
		label: 'harry',
		url: null,
		_suggestion_type: 'recent',
		_category: null,
		_count: 10,
		_rs_score: 0,
		_matched_tokens: null,
		_id: '',
		_index: null,
		_score: 0,
		_source: {},
		sectionId: 'recents',
		sectionLabel: 'Recent Suggestions',
	},
	{
		value: 'harry pott',
		label: 'harry pott',
		url: null,
		_suggestion_type: 'recent',
		_category: null,
		_count: 9,
		_rs_score: 0,
		_matched_tokens: null,
		_id: '',
		_index: null,
		_score: 0,
		_source: {},
		sectionId: 'recents',
		sectionLabel: 'Recent Suggestions',
	},
	{
		value: 'sea',
		label: 'sea',
		url: null,
		_suggestion_type: 'popular',
		_category: null,
		_count: 3,
		_rs_score: 0,
		_matched_tokens: null,
		_id: 'sea',
		_index: '.suggestions_may_08',
		_score: 45.524982,
		sectionId: 'popular',
		sectionLabel: 'Popular Suggestions',
		_source: {
			c_browser: [],
			c_companyId: [],
			c_companyIds: [],
			c_device: ['iphoneX'],
			c_email: [],
			c_platform: ['ios'],
			c_referer: [],
			c_titles: [],
			c_user_segment: [],
			count: 3,
			id: 'sea',
			indices: ['good-books-ds'],
			ip: ['103.83.145.101', '103.83.145.234', '103.77.43.213'],
			key: 'sea',
			search_characters_length: 3,
			user_id: ['jon@appbase.io', 'jon'],
		},
	},
	{
		value: 'sea shore',
		label: 'sea shore',
		url: null,
		_suggestion_type: 'popular',
		_category: null,
		_count: 3,
		_rs_score: 0,
		_matched_tokens: null,
		_id: 'sea',
		_index: '.suggestions_may_08',
		_score: 45.524982,
		sectionId: 'popular',
		sectionLabel: 'Popular Suggestions',
		_source: {
			c_browser: [],
			c_companyId: [],
			c_companyIds: [],
			c_device: ['iphoneX'],
			c_email: [],
			c_platform: ['ios'],
			c_referer: [],
			c_titles: [],
			c_user_segment: [],
			count: 3,
			id: 'sea',
			indices: ['good-books-ds'],
			ip: ['103.83.145.101', '103.83.145.234', '103.77.43.213'],
			key: 'sea',
			search_characters_length: 3,
			user_id: ['jon@appbase.io', 'jon'],
		},
	},
];

const CustomRecentIcon = () => (
	<svg
		alt="Recent Icon"
		height="200"
		width="200"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 212.982 212.982"
	>
		<path d="M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z" />
	</svg>
);

const CustomPopularIcon = () => (
	<svg
		alt="Popular Icon"
		height="250"
		width="250"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 212.982 212.982"
	>
		<path d="M10.19 1.5s.49 1.99.49 3.6c0 1.55-1.01 2.8-2.56 2.8S5.4 6.65 5.4 5.1l.02-.27C3.91 6.64 3 8.96 3 11.5c0 3.31 2.69 6 6 6s6-2.69 6-6c0-4.05-1.88-7.65-4.81-10zM8.91 15c-1.34 0-2.42-1.05-2.42-2.35 0-1.22.78-2.07 2.11-2.34 1.33-.27 2.7-.91 3.46-1.93.29.97.45 1.99.45 3.03 0 1.98-1.62 3.59-3.6 3.59z" />
	</svg>
);

it('should render SearchBox', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<SearchBox
					testMode
					componentId="MockSearchBox"
					dataField="original_title"
					mockData={{ hits: [] }}
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should render SearchBox with tags', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<SearchBox
					testMode
					componentId="MockSearchBox"
					dataField="original_title"
					mockData={{ hits: [] }}
					mode="tag"
					defaultValue={['Paradise Ahead!']}
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should render SearchBox with title', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<SearchBox
					testMode
					componentId="MockSearchBox"
					dataField="original_title"
					mockData={{ hits: [] }}
					title="Mock SearchBox"
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should render search icon on the right', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<SearchBox
					testMode
					componentId="MockSearchBox"
					dataField="original_title"
					mockData={{ hits: [] }}
					iconPosition="right"
					isOpen
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should display/ hide (search/ clear )icon when (showIcon/ showClear )props are set to (false/ true)', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<SearchBox
					testMode
					componentId="MockSearchBox"
					dataField="original_title"
					mockData={{ hits: [] }}
					showIcon={false}
					showClear
					defaultValue="test"
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should render custom (search/ clear icon/ recent search icon/ popular search icon) when (icon/ clearIcon/ recentSearchesIcon/ popularSearchesIcon )props are set', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<SearchBox
					testMode
					componentId="MockSearchBox"
					dataField="original_title"
					mockData={{ hits: MOCK_HITS_DATA }}
					defaultValue="harry test"
					isOpen
					showClear
					showIcon
					icon={
						<span role="img" aria-label="books-icon">
							📚
						</span>
					}
					clearIcon={
						<span role="img" aria-label="books-icon">
							❌
						</span>
					}
					innerClass={{
						'recent-search-icon': 'recent-icon',
						'popular-search-icon': 'popular-icon',
					}}
					recentSearchesIcon={<CustomRecentIcon />}
					popularSearchesIcon={<CustomPopularIcon />}
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should show voice search when showVoiceSearch prop is set', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<SearchBox
					testMode
					componentId="MockSearchBox"
					dataField="original_title"
					mockData={{ hits: [] }}
					showVoiceSearch
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should render custom dropdown UI when render prop is set', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<SearchBox
					testMode
					componentId="MockSearchBox"
					dataField="original_title"
					mockData={{ hits: MOCK_HITS_DATA }}
					isOpen
					render={({
						value,
						data,
						downshiftProps: { getItemProps, highlightedIndex },
					}) => (
						<div
							style={{
								position: 'absolute',
								padding: 10,
								color: '#424242',
								fontSize: '0.9rem',
								border: '1px solid #ddd',
								borderRadius: 4,
								marginTop: 10,
								width: '100%',
							}}
						>
							<div>
								{data.slice(0, 5).map((suggestion, index) => (
									<div
										style={{
											padding: 10,
											background:
												index === highlightedIndex ? '#eee' : 'transparent',
										}}
										key={suggestion.value}
										{...getItemProps({ item: suggestion })}
									>
										{suggestion.value}
									</div>
								))}
								{Boolean(value.length) && (
									<div
										style={{
											color: 'dodgerblue',
											padding: 10,
											cursor: 'pointer',
											background:
												highlightedIndex === data.slice(0, 5).length
													? '#eee'
													: 'transparent',
										}}
										{...getItemProps({
											item: { label: value, value },
										})}
									>
										Show all results for &quot;{value}&quot;
									</div>
								)}
							</div>
						</div>
					)}
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should render with a default value when defaultValue prop is set', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<SearchBox
					testMode
					componentId="MockSearchBox"
					dataField="original_title"
					mockData={{ hits: [] }}
					defaultValue="test"
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should render (prefixed/ suffixed) UI nodes with searchbox when (addonBefore/ addonAfter) prop is set', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<SearchBox
					testMode
					componentId="MockSearchBox"
					dataField="original_title"
					addonBefore={<h3> Before</h3>}
					addonAfter={<h3> After</h3>}
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should not render expanded dropdown when expandSuggestionsContainer prop is set to false', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<SearchBox
					testMode
					componentId="MockSearchBox"
					dataField="original_title"
					addonBefore={<h3> Before</h3>}
					addonAfter={<h3> After</h3>}
					expandSuggestionsContainer={false}
					isOpen
					mockData={{ hits: MOCK_HITS_DATA }}
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should render enterButton when enterButton prop is true', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<SearchBox
					testMode
					componentId="MockSearchBox"
					dataField="original_title"
					mockData={{ hits: [] }}
					enterButton
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should not render enterButton when enterButton prop is false', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<SearchBox
					testMode
					componentId="MockSearchBox"
					dataField="original_title"
					mockData={{ hits: [] }}
					enterButton={false}
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should render custom enterButton', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<SearchBox
					testMode
					componentId="MockSearchBox"
					dataField="original_title"
					mockData={{ hits: [] }}
					enterButton
					renderEnterButton={clickHandler => (
						<div style={{ height: '100%', display: 'flex', alignItems: 'stretch' }}>
							<button style={{ border: '1px solid #c3c3c3' }} onClick={clickHandler}>
								<span aria-label="search" role="img">
									🔍
								</span>{' '}
								Search
							</button>
						</div>
					)}
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should render SearchBox with featured suggestions', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<SearchBox
					testMode
					componentId="MockSearchBox"
					dataField="original_title"
					mockData={{ hits: MOCK_HITS_DATA_FEATURED_SUGGESTIONS }}
					isOpen
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});
