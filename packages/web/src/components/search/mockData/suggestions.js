export const DEFAULT_SUGGESTIONS = [
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

export const FEATURED_SUGGESTIONS = [
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

export const FAQ_SUGGESTIONS = [
	{
		value: "answer the query: 'harry potter collection (harry potter, #1-6)'. think step-by-step, cite the source after the answer and ensure the source is from the provided context.",
		label: "Answer the query: 'harry potter collection (harry potter, #1-6)'. Think step-by-step, cite the source after the answer and ensure the source is from the provided context.",
		url: null,
		sectionLabel: 'FAQ',
		sectionId: 'faqs',
		description: null,
		action: null,
		subAction: null,
		icon: null,
		iconURL: null,
		_suggestion_type: 'faq',
		_category: null,
		_count: null,
		_rs_score: 0,
		_matched_tokens: null,
		_answer: "The title 'Harry Potter Collection (Harry Potter, #1-6)' refers to a set of the first six books in the Harry Potter series written by J.K. Rowling. The set includes the following titles: \n\n1. Harry Potter and the Philosopher's Stone\n2. Harry Potter and the Chamber of Secrets\n3. Harry Potter and the Prisoner of Azkaban\n4. Harry Potter and the Goblet of Fire\n5. Harry Potter and the Order of Phoenix\n6. Harry Potter and the Half-Blood Prince\n\nSource: Provided context - Image metadata.",
		_id: '2198dAcUaBD',
		_index: '.ai_faqs',
		_score: 1.7386464468400926,
		_source: {
			'@timestamp': '2023-08-22T23:30:00.043957248Z',
			answer: "The title 'Harry Potter Collection (Harry Potter, #1-6)' refers to a set of the first six books in the Harry Potter series written by J.K. Rowling. The set includes the following titles: \n\n1. Harry Potter and the Philosopher's Stone\n2. Harry Potter and the Chamber of Secrets\n3. Harry Potter and the Prisoner of Azkaban\n4. Harry Potter and the Goblet of Fire\n5. Harry Potter and the Order of Phoenix\n6. Harry Potter and the Half-Blood Prince\n\nSource: Provided context - Image metadata.",
			faq_id: '1684724616304',
			order: 22,
			question: "Answer the query: 'harry potter collection (harry potter, #1-6)'. Think step-by-step, cite the source after the answer and ensure the source is from the provided context.",
			searchboxId: [
				'document_search_clone_1660208789225',
				'rs_docs',
			],
			updated_at: 1684777935,
		},
	},
	{
		value: ' who is jason barnie?',
		label: ' Who is Jason barnie?',
		url: null,
		sectionLabel: 'FAQ',
		sectionId: 'faqs',
		description: null,
		action: null,
		subAction: null,
		icon: null,
		iconURL: null,
		_suggestion_type: 'faq',
		_category: null,
		_count: null,
		_rs_score: 0,
		_matched_tokens: null,
		_answer: 'Jason Bourne is a highly skilled and trained operative who works as a spy for the CIA.',
		_id: '2198dAcUaBy',
		_index: '.ai_faqs',
		_score: 1.633791272998439,
		_source: {
			'@timestamp': '2023-08-22T23:30:00.043471872Z',
			answer: 'Jason Bourne is a highly skilled and trained operative who works as a spy for the CIA.',
			faq_id: '1684565913088',
			order: 11,
			question: ' Who is Jason barnie?',
			searchboxId: [
				'appbase_test',
				'document_search_clone_1660208789225',
				'rs_docs',
			],
			updated_at: 1686739959,
		},
	},
	{
		value: 'vue quick start',
		label: 'Vue Integration',
		url: null,
		sectionLabel: 'Quick start guide',
		sectionId: 'Quick start guide1',
		description: 'Step-by-step guide to build search UI with ReactiveSearch(Vue)',
		action: 'navigate',
		subAction: '{"link":"https://docs.reactivesearch.io/docs/reactivesearch/vue/overview/QuickStart/","target":"_blank"}',
		icon: null,
		iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/1184px-Vue.js_Logo_2.svg.png',
		_suggestion_type: 'featured',
		_category: null,
		_count: null,
		_rs_score: 0,
		_matched_tokens: null,
		_id: 'fcb07a9a-1836-425f-8944-373a9f6004a0',
		_index: null,
		_score: 2.9332935658217987,
		_source: {},
	},
	{
		value: 'react integration ',
		label: 'React Integration',
		url: null,
		sectionLabel: 'Quick start guide',
		sectionId: 'Quick start guide1',
		description: 'Step-by-step guide to build search UI with ReactiveSearch(React)',
		action: 'navigate',
		subAction: '{"link":"https://docs.reactivesearch.io/docs/reactivesearch/v3/overview/quickstart/","target":"_blank"}',
		icon: null,
		iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/2300px-React-icon.svg.png',
		_suggestion_type: 'featured',
		_category: null,
		_count: null,
		_rs_score: 0,
		_matched_tokens: null,
		_id: '5ba74b0e-abb5-483a-acb0-efde2dee872e',
		_index: null,
		_score: 2.863583973908053,
		_source: {},
	},
	{
		value: 'paradise lost',
		label: 'Paradise Lost',
		url: null,
		sectionLabel: null,
		sectionId: 'index',
		description: null,
		action: null,
		subAction: null,
		icon: null,
		iconURL: null,
		_suggestion_type: 'index',
		_category: null,
		_count: null,
		_rs_score: 0,
		_matched_tokens: null,
		_id: '1jftXXEBdEU4aeo6Gdqs',
		_index: 'good-books-ds',
		_score: 1,
		_source: {
			authors: 'John Milton, John      Leonard',
			average_rating: 3.8,
			average_rating_rounded: 4,
			books_count: 819,
			id: 984,
			image: 'https://images.gr-assets.com/books/1455618673l/15997.jpg',
			image_medium: 'https://images.gr-assets.com/books/1455618673m/15997.jpg',
			isbn: '140424393',
			language_code: 'eng',
			original_publication_year: 1667,
			original_series: '',
			original_title: 'Paradise Lost',
			ratings_count: 96316,
			title: 'Paradise Lost',
		},
	},
	{
		value: 'antigone',
		label: 'Antigone',
		url: null,
		sectionLabel: null,
		sectionId: 'index',
		description: null,
		action: null,
		subAction: null,
		icon: null,
		iconURL: null,
		_suggestion_type: 'index',
		_category: null,
		_count: null,
		_rs_score: 0,
		_matched_tokens: null,
		_id: '1zftXXEBdEU4aeo6Gdqs',
		_index: 'good-books-ds',
		_score: 1,
		_source: {
			authors: 'Jean Anouilh',
			average_rating: 3.8,
			average_rating_rounded: 4,
			books_count: 35,
			id: 9839,
			image: 'https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png',
			image_medium: 'https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png',
			isbn: '041330860X',
			language_code: '',
			original_publication_year: 1944,
			original_series: '',
			original_title: 'Antigone',
			ratings_count: 10449,
			title: 'Antigone',
		},
	},
];
