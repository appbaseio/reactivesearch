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
			<ReactiveBase enableAppbase app="test" url="https://foo:bar@localhost:800">
				<SearchBox
					mode="test"
					componentId="MockSearchBox"
					dataField="original_title"
					mockData={{ hits: [] }}
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should render SearchBox with title', () => {
	const elem = renderer
		.create(
			<ReactiveBase enableAppbase app="test" url="https://foo:bar@localhost:800">
				<SearchBox
					mode="test"
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
			<ReactiveBase enableAppbase app="test" url="https://foo:bar@localhost:800">
				<SearchBox
					mode="test"
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
			<ReactiveBase enableAppbase app="test" url="https://foo:bar@localhost:800">
				<SearchBox
					mode="test"
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
			<ReactiveBase enableAppbase app="test" url="https://foo:bar@localhost:800">
				<SearchBox
					mode="test"
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
			<ReactiveBase enableAppbase app="test" url="https://foo:bar@localhost:800">
				<SearchBox
					mode="test"
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
			<ReactiveBase enableAppbase app="test" url="https://foo:bar@localhost:800">
				<SearchBox
					mode="test"
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
			<ReactiveBase enableAppbase app="test" url="https://foo:bar@localhost:800">
				<SearchBox
					mode="test"
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

it('should render default suggestions when defaultSuggestions prop is set', () => {
	const elem = renderer
		.create(
			<ReactiveBase enableAppbase app="test" url="https://foo:bar@localhost:800">
				<SearchBox
					mode="test"
					componentId="MockSearchBox"
					dataField="original_title"
					mockData={{ hits: [] }}
					defaultSuggestions={[
						{ label: 'Sherlock Holmes', value: 'Sherlock Holmes' },
						{ label: 'The Lord of the Rings', value: 'The Lord of the Rings' },
					]}
					isOpen
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should render (prefixed/ suffixed) UI nodes with searchbox when (addonBefore/ addonAfter) prop is set', () => {
	const elem = renderer
		.create(
			<ReactiveBase enableAppbase app="test" url="https://foo:bar@localhost:800">
				<SearchBox
					mode="test"
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
			<ReactiveBase enableAppbase app="test" url="https://foo:bar@localhost:800">
				<SearchBox
					mode="test"
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
