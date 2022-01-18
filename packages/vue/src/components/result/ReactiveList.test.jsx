import { mount } from '@vue/test-utils';
import Vue from 'vue';
import { RLConnected as ReactiveList } from './ReactiveList.jsx';
import ReactiveBase from '../ReactiveBase/index.jsx';
import ResultCard from './ResultCard.jsx';

const MOCK_HITS_DATA = [
	{
		_index: 'good-books-ds',
		_type: '_doc',
		_id: '1jftXXEBdEU4aeo6Gdqs',
		_score: 1,
		_source: {
			image: 'https://images.gr-assets.com/books/1455618673l/15997.jpg',
			average_rating_rounded: 4,
			books_count: 819,
			original_title: 'Paradise Lost',
			image_medium: 'https://images.gr-assets.com/books/1455618673m/15997.jpg',
			isbn: '140424393',
			average_rating: 3.8,
			original_publication_year: 1667,
			title: 'Paradise Lost',
			language_code: 'eng',
			id: 984,
			ratings_count: 96316,
			original_series: '',
			authors: 'John Milton, John      Leonard',
		},
	},
	{
		_index: 'good-books-ds',
		_type: '_doc',
		_id: '1zftXXEBdEU4aeo6Gdqs',
		_score: 1,
		_source: {
			image: 'https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png',
			average_rating_rounded: 4,
			books_count: 35,
			original_title: 'Antigone',
			image_medium:
				'https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png',
			isbn: '041330860X',
			average_rating: 3.8,
			original_publication_year: 1944,
			title: 'Antigone',
			language_code: '',
			id: 9839,
			ratings_count: 10449,
			original_series: '',
			authors: 'Jean Anouilh',
		},
	},
	{
		_index: 'good-books-ds',
		_type: '_doc',
		_id: '2DftXXEBdEU4aeo6Gdqs',
		_score: 1,
		_source: {
			image: 'https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png',
			average_rating_rounded: 4,
			books_count: 5,
			original_title:
				'The Chronicles of Narnia - The Lion, the Witch, and the Wardrobe Official Illustrated Movie Companion',
			image_medium:
				'https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png',
			isbn: '60827874',
			average_rating: 4.48,
			original_publication_year: 2005,
			title: 'The Chronicles of Narnia - The Lion, the Witch, and the Wardrobe Official Illustrated Movie Companion',
			language_code: 'en-US',
			id: 9838,
			ratings_count: 7328,
			original_series: '',
			authors: 'Perry Moore, Andrew Adamson, C.S. Lewis',
		},
	},
	{
		_index: 'good-books-ds',
		_type: '_doc',
		_id: '2TftXXEBdEU4aeo6Gdqs',
		_score: 1,
		_source: {
			image: 'https://images.gr-assets.com/books/1373059909l/18079719.jpg',
			average_rating_rounded: 4,
			books_count: 24,
			original_title: 'Grasshopper Jungle',
			image_medium: 'https://images.gr-assets.com/books/1373059909m/18079719.jpg',
			isbn: '525426035',
			average_rating: 3.66,
			original_publication_year: 2014,
			title: 'Grasshopper Jungle',
			language_code: 'eng',
			id: 9837,
			ratings_count: 11890,
			original_series: '',
			authors: 'Andrew  Smith',
		},
	},
	{
		_index: 'good-books-ds',
		_type: '_doc',
		_id: '2jftXXEBdEU4aeo6Gdqs',
		_score: 1,
		_source: {
			image: 'https://images.gr-assets.com/books/1367533032l/72855.jpg',
			average_rating_rounded: 4,
			books_count: 21,
			original_title: 'Lake in the Clouds',
			image_medium: 'https://images.gr-assets.com/books/1367533032m/72855.jpg',
			isbn: '553582798',
			average_rating: 4.31,
			original_publication_year: 2002,
			title: 'Lake in the Clouds (Wilderness, #3)',
			language_code: 'eng',
			id: 9835,
			ratings_count: 9223,
			original_series: 'Wilderness',
			authors: 'Sara Donati',
		},
	},
];

const ListItem = {
	name: 'ListItem',
	props: {
		item: Object,
	},
	render() {
		const data = this.$props.item;
		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					width: '250px',
					padding: '1rem',
					margin: '5px',
					boxShadow: '0 1px 3px rgb(0 0 0 / 12%), 0 1px 2px rgb(0 0 0 / 24%)',
					background: 'white',
				}}
				key={data._id}
			>
				<img
					src={data.image}
					alt="Book Cover"
					style={{
						height: '220px',
						width: '100%',
						objectFit: 'cover',
						marginBottom: '.5rem',
					}}
				/>
				<div style={{}}>
					<h3 style={{ margin: '0' }} className="book-header">
						{data.original_title}
					</h3>
					<div className="flex column justify-space-between">
						<div>
							<div>
								by <span style={{ color: '#9d9d9d' }}>{data.authors}</span>
							</div>
							<div style={{ padding: '10px 0' }}>
								<span className="stars">
									{
										Array(data.average_rating_rounded)
											.fill('x')
											// eslint-disable-next-line
											.map((_, index) => (
												// eslint-disable-next-line
												<span key={index} role="img" aria-label="start">
													⭐
												</span>
											)) // eslint-disable-line
									}
								</span>
								<span
									style={{
										marginLeft: '5px',
										color: '#6b6b6b',
									}}
								>
									({data.average_rating} avg)
								</span>
							</div>
						</div>
						<span>Pub {data.original_publication_year}</span>
					</div>
				</div>
			</div>
		);
	},
};

const BooksCard = {
	name: 'BooksCard',
	props: {
		item: Object,
	},
	render() {
		const { item } = this.$props;
		return (
			<ResultCard>
				<ResultCard.components.ResultCardImage src={item.image} />
				<ResultCard.components.ResultCardTitle>
					<div
						className="book-title-card text-center"
						dangerouslySetInnerHTML={{
							__html: item.original_title,
						}}
					/>
				</ResultCard.components.ResultCardTitle>
				<ResultCard.components.ResultCardDescription>
					<div className="flex column justify-space-between text-center">
						<div>
							<div>
								by <span className="authors-list">{item.authors}</span>
							</div>
							<div className="ratings-list flex align-center justify-center">
								<span className="stars">
									{Array(item.average_rating_rounded)
										.fill('x')
										.map((_, index) => (
											// eslint-disable-next-line
											<i className="fas fa-star" key={index} />
										))}
								</span>
								<span className="avg-rating">({item.average_rating} avg)</span>
							</div>
						</div>
						<span className="pub-year">Pub {item.original_publication_year}</span>
					</div>
				</ResultCard.components.ResultCardDescription>
			</ResultCard>
		);
	},
};

describe('ReactiveList', () => {
	it('should render items in a list layout', () => {
		const wrapper = mount({
			name: 'TestComponent',
			render() {
				return (
					<ReactiveBase app="test" url="https://foo:bar@localhost:800">
						<ReactiveList
							mode="test"
							componentId="MockSearchResult"
							dataField="original_title.keyword"
							className="result-list-container"
							from={0}
							size={3}
							renderItem={({ item }) => <ListItem item={item} />}
							mockData={{ hits: MOCK_HITS_DATA }}
						/>
					</ReactiveBase>
				);
			},
		});

		expect(wrapper.element).toMatchSnapshot();
	});

	it('should render items in a card layout', () => {
		const wrapper = mount({
			name: 'TestComponent',
			render() {
				return (
					<ReactiveBase app="test" url="https://foo:bar@localhost:800">
						<ReactiveList
							mode="test"
							componentId="MockSearchResult"
							dataField="original_title.keyword"
							className="result-list-container"
							from={0}
							size={3}
							render={(props) => (
								<div>
									{props.data.map((item) => (
										<BooksCard item={item} />
									))}
								</div>
							)}
							mockData={{ hits: MOCK_HITS_DATA }}
						/>
					</ReactiveBase>
				);
			},
		});

		expect(wrapper.element).toMatchSnapshot();
	});

	it('should render no results message', () => {
		const wrapper = mount({
			name: 'TestComponent',
			render() {
				return (
					<ReactiveBase app="test" url="https://foo:bar@localhost:800">
						<ReactiveList
							mode="test"
							componentId="MockSearchResult"
							dataField="original_title.keyword"
							className="result-list-container"
							from={0}
							size={0}
							render={(props) => (
								<div>
									{props.data.map((item) => (
										<BooksCard item={item} />
									))}
								</div>
							)}
							mockData={{ hits: [] }}
							renderNoResults="Test: No results rendered!"
						/>
					</ReactiveBase>
				);
			},
		});

		expect(wrapper.element).toMatchSnapshot();
	});

	it('should render pagination when set to true', () => {
		const wrapper = mount({
			name: 'TestComponent',
			render() {
				return (
					<ReactiveBase app="test" url="https://foo:bar@localhost:800">
						<ReactiveList
							mode="test"
							componentId="MockSearchResult"
							dataField="original_title.keyword"
							className="result-list-container"
							from={0}
							size={3}
							render={(props) => (
								<div>
									{props.data.map((item) => (
										<BooksCard item={item} />
									))}
								</div>
							)}
							mockData={{ hits: MOCK_HITS_DATA, total: 9418 }}
							pagination={true}
						/>
					</ReactiveBase>
				);
			},
		});

		expect(wrapper.element).toMatchSnapshot();
	});

	it('should render pagination at top', () => {
		const wrapper = mount({
			name: 'TestComponent',
			render() {
				return (
					<ReactiveBase app="test" url="https://foo:bar@localhost:800">
						<ReactiveList
							mode="test"
							componentId="MockSearchResult"
							dataField="original_title.keyword"
							className="result-list-container"
							from={0}
							size={3}
							render={(props) => (
								<div>
									{props.data.map((item) => (
										<BooksCard item={item} />
									))}
								</div>
							)}
							mockData={{ hits: MOCK_HITS_DATA, total: 9418 }}
							pagination={true}
							paginationAt="top"
						/>
					</ReactiveBase>
				);
			},
		});

		expect(wrapper.element).toMatchSnapshot();
	});

	it('should render pagination at bottom', () => {
		const wrapper = mount({
			name: 'TestComponent',
			render() {
				return (
					<ReactiveBase app="test" url="https://foo:bar@localhost:800">
						<ReactiveList
							mode="test"
							componentId="MockSearchResult"
							dataField="original_title.keyword"
							className="result-list-container"
							from={0}
							size={3}
							render={(props) => (
								<div>
									{props.data.map((item) => (
										<BooksCard item={item} />
									))}
								</div>
							)}
							mockData={{ hits: MOCK_HITS_DATA, total: 9418 }}
							pagination={true}
							paginationAt="bottom"
						/>
					</ReactiveBase>
				);
			},
		});

		expect(wrapper.element).toMatchSnapshot();
	});

	it('should render pagination at both ends', () => {
		const wrapper = mount({
			name: 'TestComponent',
			render() {
				return (
					<ReactiveBase app="test" url="https://foo:bar@localhost:800">
						<ReactiveList
							mode="test"
							componentId="MockSearchResult"
							dataField="original_title.keyword"
							className="result-list-container"
							from={0}
							size={3}
							render={(props) => (
								<div>
									{props.data.map((item) => (
										<BooksCard item={item} />
									))}
								</div>
							)}
							mockData={{ hits: MOCK_HITS_DATA, total: 9418 }}
							pagination={true}
							paginationAt="both"
						/>
					</ReactiveBase>
				);
			},
		});

		expect(wrapper.element).toMatchSnapshot();
	});

	it('should render items as defined in renderItem', () => {
		const wrapper = mount({
			name: 'TestComponent',
			render() {
				return (
					<ReactiveBase app="test" url="https://foo:bar@localhost:800">
						<ReactiveList
							mode="test"
							componentId="MockSearchResult"
							dataField="original_title.keyword"
							className="result-list-container"
							from={0}
							size={3}
							renderItem={({ item }) => <ListItem item={item} />}
							mockData={{ hits: MOCK_HITS_DATA }}
						/>
					</ReactiveBase>
				);
			},
		});

		expect(wrapper.element).toMatchSnapshot();
	});

	it('should display result stats when showResultStats is set to true', () => {
		const wrapper = mount({
			name: 'TestComponent',
			render() {
				return (
					<ReactiveBase app="test" url="https://foo:bar@localhost:800">
						<ReactiveList
							mode="test"
							componentId="MockSearchResult"
							dataField="original_title.keyword"
							className="result-list-container"
							from={0}
							size={3}
							renderItem={({ item }) => <ListItem item={item} />}
							mockData={{ hits: MOCK_HITS_DATA, total: 9418 }}
							showResultStats={true}
						/>
					</ReactiveBase>
				);
			},
		});

		expect(wrapper.element).toMatchSnapshot();
	});

	it('should display result stats when showResultStats is set to false', () => {
		const wrapper = mount({
			name: 'TestComponent',
			render() {
				return (
					<ReactiveBase app="test" url="https://foo:bar@localhost:800">
						<ReactiveList
							mode="test"
							componentId="MockSearchResult"
							dataField="original_title.keyword"
							className="result-list-container"
							from={0}
							size={3}
							renderItem={({ item }) => <ListItem item={item} />}
							mockData={{ hits: MOCK_HITS_DATA, total: 9418 }}
							showResultStats={false}
						/>
					</ReactiveBase>
				);
			},
		});

		expect(wrapper.element).toMatchSnapshot();
	});

	it('should render custom result stats message', () => {
		const wrapper = mount({
			name: 'TestComponent',
			render() {
				return (
					<ReactiveBase app="test" url="https://foo:bar@localhost:800">
						<ReactiveList
							mode="test"
							componentId="MockSearchResult"
							dataField="original_title.keyword"
							className="result-list-container"
							from={0}
							size={3}
							renderItem={({ item }) => <ListItem item={item} />}
							mockData={{ hits: MOCK_HITS_DATA, total: 9418, time: 2.5 }}
							showResultStats={true}
							renderResultStats={({ numberOfResults, time, displayedResults }) =>
								`Custom: Showing ${displayedResults} of total ${numberOfResults} in ${time} ms`
							}
						/>
					</ReactiveBase>
				);
			},
		});

		expect(wrapper.element).toMatchSnapshot();
	});
});
