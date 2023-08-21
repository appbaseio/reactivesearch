
import ReactDOM from 'react-dom';
import React from 'react';
import renderer, { act } from 'react-test-renderer';
import ReactiveBase from '../basic/ReactiveBase';
import AIAnswer from './AIAnswer/index';


const MOCK_HITS_DATA = [
	{
		_index: 'good-books-ds',
		_type: '_doc',
		_id: '2TftXXEBdEU4aeo6Gdqs',
		_score: 70.69977,
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
		_id: 'nj7tXXEBhDwVijd9MkkX',
		_score: 8.691772,
		_source: {
			image: 'https://images.gr-assets.com/books/1332140681l/41681.jpg',
			average_rating_rounded: 4,
			books_count: 534,
			original_title: 'The Jungle',
			image_medium: 'https://images.gr-assets.com/books/1332140681m/41681.jpg',
			isbn: '1884365302',
			average_rating: 3.72,
			original_publication_year: 1906,
			title: 'The Jungle',
			language_code: 'eng',
			id: 879,
			ratings_count: 97468,
			original_series: '',
			authors: 'Upton Sinclair, Earl Lee, Kathleen DeGrave',
		},
	},
	{
		_index: 'good-books-ds',
		_type: '_doc',
		_id: '2TftXXEBdEU4aeo6hOBa',
		_score: 8.691772,
		_source: {
			image: 'https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png',
			average_rating_rounded: 4,
			books_count: 35,
			original_title: 'Rubyfruit Jungle',
			image_medium: 'https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png',
			isbn: '553146963',
			average_rating: 3.88,
			original_publication_year: 1973,
			title: 'Rubyfruit Jungle',
			language_code: 'eng',
			id: 4455,
			ratings_count: 22583,
			original_series: '',
			authors: 'Rita Mae Brown',
		},
	},
	{
		_index: 'good-books-ds',
		_type: '_doc',
		_id: 'grDtXXEB2-YohfeSsMfi',
		_score: 8.691772,
		_source: {
			image: 'https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png',
			average_rating_rounded: 3,
			books_count: 71,
			original_title: 'Lipstick Jungle',
			image_medium: 'https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png',
			isbn: '786887079',
			average_rating: 3.39,
			original_publication_year: 2005,
			title: 'Lipstick Jungle',
			language_code: 'eng',
			id: 2546,
			ratings_count: 35792,
			original_series: '',
			authors: 'Candace Bushnell',
		},
	},
	{
		_index: 'good-books-ds',
		_type: '_doc',
		_id: 'GLDtXXEB2-YohfeSysvk',
		_score: 7.720322,
		_source: {
			image: 'https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png',
			average_rating_rounded: 4,
			books_count: 227,
			original_title: 'The Jungle Books',
			image_medium: 'https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png',
			isbn: '451529758',
			average_rating: 4,
			original_publication_year: 1895,
			title: 'The Jungle Books',
			language_code: 'eng',
			id: 1695,
			ratings_count: 68750,
			original_series: '',
			authors: 'Rudyard Kipling, Alev Lytle Croutier',
		},
	},
	{
		_index: 'good-books-ds',
		_type: '_doc',
		_id: 'kD7tXXEBhDwVijd94lyY',
		_score: 7.720322,
		_source: {
			image: 'https://images.gr-assets.com/books/1327873594l/77270.jpg',
			average_rating_rounded: 4,
			books_count: 1306,
			original_title: 'The Jungle Book',
			image_medium: 'https://images.gr-assets.com/books/1327873594m/77270.jpg',
			isbn: '812504690',
			average_rating: 3.94,
			original_publication_year: 1894,
			title: 'The Jungle Book',
			language_code: 'eng',
			id: 1327,
			ratings_count: 67107,
			original_series: '',
			authors: 'Rudyard Kipling',
		},
	},
	{
		_index: 'good-books-ds',
		_type: '_doc',
		_id: 'FT7tXXEBhDwVijd9MksX',
		_score: 6.944194,
		_source: {
			image: 'https://images.gr-assets.com/books/1320418408l/2637138.jpg',
			average_rating_rounded: 4,
			books_count: 9,
			original_title: 'Welcome to the Jungle',
			image_medium: 'https://images.gr-assets.com/books/1320418408m/2637138.jpg',
			isbn: '345507460',
			average_rating: 4.09,
			original_publication_year: 2008,
			title: 'Welcome to the Jungle (The Dresden Files, #0.5)',
			language_code: 'eng',
			id: 8424,
			ratings_count: 13833,
			original_series: 'The Dresden Files',
			authors: 'Jim Butcher',
		},
	},
];

const MOCK_AI_RESPONSE = {
	sessionId: 'mLjPtoymnJNnQxdcnGgJCy',
	response: {
		answer: {
			documentIds: [
				'2TftXXEBdEU4aeo6Gdqs',
				'nj7tXXEBhDwVijd9MkkX',
				'2TftXXEBdEU4aeo6hOBa',
				'grDtXXEB2-YohfeSsMfi',
				'GLDtXXEB2-YohfeSysvk',
				'kD7tXXEBhDwVijd94lyY',
				'FT7tXXEBhDwVijd9MksX',
			],
			model: 'gpt-3.5-turbo-0613',
			text: '"Grasshopper Jungle" is a young adult science fiction novel written by Andrew Smith. It tells the story of Austin Szerba, a teenager living in the small town of Ealing, Iowa. The town is suddenly invaded by giant, man-eating praying mantises that were created as part of a military experiment gone wrong.As Austin and his best friend Robby navigate through the chaos, they also grapple with their own personal struggles. Austin finds himself torn between his girlfriend, Shann, and his confusing feelings towards both her and his openly gay best friend, Robby.The novel touches on themes of sexuality, friendship, and identity, while also exploring the idea of humanity and what it means to be human. It combines elements of coming-of-age with science fiction, creating a unique and thought-provoking story."Grasshopper Jungle" received critical acclaim for its unconventional storytelling, strong character development, and exploration of complex social issues. It has been described as a dark, thrilling, and sometimes humorous tale that challenges traditional notions of literature for young adults.',
		},
		question: 'Answer the following: Grasshopper Jungle',
	},
	messages: [
		{
			content: 'Answer the following: Grasshopper Jungle',
			role: 'user',
		},
		{
			content: '"Grasshopper Jungle" is a young adult science fiction novel written by Andrew Smith. It tells the story of Austin Szerba, a teenager living in the small town of Ealing, Iowa. The town is suddenly invaded by giant, man-eating praying mantises that were created as part of a military experiment gone wrong.\n\nAs Austin and his best friend Robby navigate through the chaos, they also grapple with their own personal struggles. Austin finds himself torn between his girlfriend, Shann, and his confusing feelings towards both her and his openly gay best friend, Robby.The novel touches on themes of sexuality, friendship, and identity, while also exploring the idea of humanity and what it means to be human. It combines elements of coming-of-age with science fiction, creating a unique and thought-provoking story."Grasshopper Jungle" received critical acclaim for its unconventional storytelling, strong character development, and exploration of complex social issues. It has been described as a dark, thrilling, and sometimes humorous tale that challenges traditional notions of literature for young adults.',
			role: 'assistant',
		},
	],
	isTyping: false,
};


it('should render AIAnswer', async () => {
	const container = document.createElement('div');
	const elem = renderer.create(
		<ReactiveBase app="test" url="https://foo:bar@localhost:800">
			<AIAnswer
				testMode
				componentId="MockAIAnswer"
				mockData={{ hits: MOCK_HITS_DATA, AI_RESPONSE: MOCK_AI_RESPONSE }}
			/>
		</ReactiveBase>, container,
	);

	// Wait for all updates to complete
	await act(async () => {
		await new Promise(resolve => setTimeout(resolve, 1000));
	});

	expect(elem.toJSON()).toMatchSnapshot();

	// Unmount the component
	ReactDOM.unmountComponentAtNode(container);
});
