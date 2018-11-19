import React from 'react';
import baseConfig from './../base/web';

export default {
	...baseConfig,
	title: 'Built with Reactive Search',
	description: (
		<React.Fragment>
			Check out our demo apps powered by Reactivesearch.
		</React.Fragment>
	),
	demos: [
		{
			src: 'images/apps/airbeds.png',
			title: 'Airbeds',
			href: 'https://opensource.appbase.io/reactivesearch/demos/airbeds/',
			description: 'An airbnb inspired app for browsing housing areas in Seattle',
		},
		{
			src: 'images/apps/productsearch.png',
			title: 'Product Search',
			href: 'https://opensource.appbase.io/reactivesearch/demos/producthunt/',
			description: '',
		},
		{
			src: 'images/apps/gitxplore.png',
			title: 'GitHub Search',
			href: 'https://opensource.appbase.io/reactivesearch/demos/gitxplore/',
			description: '',
		},
		{
			src: 'images/apps/carstore.png',
			title: 'Car Store',
			href: 'https://opensource.appbase.io/reactivesearch/demos/ecommerce/',
			description: '',
		},
		{
			src: 'images/apps/goodbooks.png',
			title: 'Book Search',
			href: 'https://opensource.appbase.io/reactivesearch/demos/goodbooks/',
			description: '',
		},
		{
			src: 'images/apps/technews.png',
			title: 'Tech News Search',
			href: 'https://opensource.appbase.io/reactivesearch/demos/technews/',
			description: '',
		},
	],
};
