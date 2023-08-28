import React from 'react';
import renderer, { act } from 'react-test-renderer';
import ReactiveBase from '../basic/ReactiveBase';
import SearchBox from './SearchBox';
import { AI, DEFAULT_SUGGESTIONS, DOCUMENT_SUGGESTIONS, FAQ_SUGGESTIONS, DEFAULT_SUGGESTIONS as MOCK_HITS_DATA, FEATURED_SUGGESTIONS as MOCK_HITS_DATA_FEATURED_SUGGESTIONS } from './mockData/suggestions';

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
			<ReactiveBase app="test" url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@localhost:800">
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
			<ReactiveBase app="test" url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@localhost:800">
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
			<ReactiveBase app="test" url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@localhost:800">
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
			<ReactiveBase app="test" url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@localhost:800">
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

it('should render SearchBox with keyboard shortcuts', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@localhost:800">
				<SearchBox
					testMode
					componentId="MockSearchBox"
					dataField="original_title"
					focusShortcuts={['CMD + A']}
					mockData={{ hits: [] }}
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should hide navigation footer', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@localhost:800">
				<SearchBox
					testMode
					componentId="MockSearchBox"
					dataField="original_title"
					showSuggestionsFooter={false}
					isOpen
					mockData={{ hits: DEFAULT_SUGGESTIONS }}
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});


it('should display/ hide (search/ clear )icon when (showIcon/ showClear )props are set to (false/ true)', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@localhost:800">
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
			<ReactiveBase app="test" url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@localhost:800">
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
			<ReactiveBase app="test" url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@localhost:800">
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
			<ReactiveBase app="test" url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@localhost:800">
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
			<ReactiveBase app="test" url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@localhost:800">
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
			<ReactiveBase app="test" url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@localhost:800">
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
			<ReactiveBase app="test" url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@localhost:800">
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
			<ReactiveBase app="test" url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@localhost:800">
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
			<ReactiveBase app="test" url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@localhost:800">
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
			<ReactiveBase app="test" url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@localhost:800">
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
			<ReactiveBase app="test" url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@localhost:800">
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

it('should render SearchBox with FAQ suggestions', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@localhost:800">
				<SearchBox
					testMode
					componentId="MockSearchBox"
					dataField="original_title"
					mockData={{ hits: FAQ_SUGGESTIONS }}
					isOpen
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should render SearchBox with Document suggestions', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@localhost:800">
				<SearchBox
					testMode
					componentId="MockSearchBox"
					dataField="original_title"
					mockData={{ hits: DOCUMENT_SUGGESTIONS }}
					isOpen
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should render AI response', async () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@localhost:800">
				<SearchBox
					testMode
					componentId="MockSearchBox"
					dataField="original_title"
					mockData={{
						hits: AI.MOCK_HITS_DATA,
						AI_RESPONSE: AI.MOCK_AI_RESPONSE,
						rawData: AI.MOCK_RAW_DATA,
					}}
					enableAI
					isOpen
				/>
			</ReactiveBase>,
		);

	// Wait for all updates to complete
	await act(async () => {
		await new Promise(resolve => setTimeout(resolve, 0));
	});

	expect(elem.toJSON()).toMatchSnapshot();
});


it('should render AI response & askButton & enterButton', async () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@localhost:800">
				<SearchBox
					testMode
					componentId="MockSearchBox"
					dataField="original_title"
					mockData={{
						hits: AI.MOCK_HITS_DATA,
						AI_RESPONSE: AI.MOCK_AI_RESPONSE,
						rawData: AI.MOCK_RAW_DATA,
					}}
					AIUIConfig={{
						askButton: true,
					}}
					enableAI
					isOpen
				/>
			</ReactiveBase>,
		);

	// Wait for all updates to complete
	await act(async () => {
		await new Promise(resolve => setTimeout(resolve, 0));
	});

	expect(elem.toJSON()).toMatchSnapshot();
});


it('should render AI response & triggerOn=question', async () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@localhost:800">
				<SearchBox
					componentId="MockSearchBox"
					dataField="original_title"
					defaultValue="Harry potter?"
					mockData={{
						hits: AI.MOCK_HITS_DATA,
						AI_RESPONSE: AI.MOCK_AI_RESPONSE,
						rawData: AI.MOCK_RAW_DATA,
					}}
					AIUIConfig={{
						askButton: true,
						triggerOn: 'question',
					}}
					enableAI
					isOpen
				/>
			</ReactiveBase>,
		);

	// Wait for all updates to complete
	await act(async () => {
		await new Promise(resolve => setTimeout(resolve, 0));
	});

	expect(elem.toJSON()).toMatchSnapshot();
});

it('should render AI response & triggerOn=manual', async () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@localhost:800">
				<SearchBox
					componentId="MockSearchBox"
					dataField="original_title"
					defaultValue="Harry potter?"
					mockData={{
						hits: AI.MOCK_HITS_DATA,
						AI_RESPONSE: AI.MOCK_AI_RESPONSE,
						rawData: AI.MOCK_RAW_DATA,
					}}
					AIUIConfig={{
						askButton: true,
						triggerOn: 'manual',
						renderTriggerMessage: 'Click to trigger AI 🤖',
					}}
					enableAI
					isOpen
				/>
			</ReactiveBase>,
		);

	// Wait for all updates to complete
	await act(async () => {
		await new Promise(resolve => setTimeout(resolve, 0));
	});

	expect(elem.toJSON()).toMatchSnapshot();
});

it('should render AI response & showSourceDocuments', async () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@localhost:800">
				<SearchBox
					testMode
					componentId="MockSearchBox"
					dataField="original_title"
					mockData={{
						hits: AI.MOCK_HITS_DATA,
						AI_RESPONSE: AI.MOCK_AI_RESPONSE,
						rawData: AI.MOCK_RAW_DATA,
					}}
					AIUIConfig={{
						showSourceDocuments: true,
					}}
					enableAI
					isOpen
				/>
			</ReactiveBase>,
		);

	// Wait for all updates to complete
	await act(async () => {
		await new Promise(resolve => setTimeout(resolve, 0));
	});

	expect(elem.toJSON()).toMatchSnapshot();
});

it('should render AI response & custom source documents', async () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@localhost:800">
				<SearchBox
					testMode
					componentId="MockSearchBox"
					dataField="original_title"
					mockData={{
						hits: AI.MOCK_HITS_DATA,
						AI_RESPONSE: AI.MOCK_AI_RESPONSE,
						rawData: AI.MOCK_RAW_DATA,
					}}
					AIUIConfig={{
						showSourceDocuments: true,
						renderSourceDocument: obj => <span role="img" aria-label="img">❤️ {obj.original_title}</span>,
					}}
					enableAI
					isOpen
				/>
			</ReactiveBase>,
		);

	// Wait for all updates to complete
	await act(async () => {
		await new Promise(resolve => setTimeout(resolve, 0));
	});

	expect(elem.toJSON()).toMatchSnapshot();
});
