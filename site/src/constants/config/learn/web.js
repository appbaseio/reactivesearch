import React from 'react';
import theme from './../../theme/web';
import baseConfig from './../base/web';

const { primary, primaryDark } = theme;

export default {
	...baseConfig,
	title: 'Get Started with Reactive Search',
	description: (
		<React.Fragment>
			Use our step-by-step guide to learn all about Reactive Search, or check out our{' '}
			<a
				rel="noopener noreferrer"
				href="https://docs.appbase.io/docs/reactivesearch/v3/overview/quickstart/"
				target="_blank"
			>
				docs
			</a>
			.
		</React.Fragment>
	),
	installationSteps: [
		{
			title: 'Install ReactiveSearch',
			descriptions: [
				'ReactiveSearch is a set of React UI components for building data-driven UIs with ElasticSearch.',
			],
			codes: ['npm install @appbaseio/reactivesearch'],
		},
		{
			title: 'Connect to your ES index',
			descriptions: [
				'ReactiveSearch components can connect to an Elasticsearch index hosted anywhere.',
				<React.Fragment>
					Create a free app (aka index) with{' '}
					<a rel="noopener noreferrer" href="https://appbase.io" target="_blank">
						appbase.io
					</a>
					.
				</React.Fragment>,
			],
			links: [
				{
					title: 'READ MORE',
					href: 'https://docs.appbase.io/docs/reactivesearch/v3/overview/reactivebase/',
				},
			],
		},
		{
			title: 'Create or Import dataset',
			descriptions: [
				'Use Dejavu, an open-source databrowser from appbase.io to create, view, edit and import dataset into your Elasticsearch index.',
			],
			links: [
				{
					title: 'Dejavu',
					href: 'https://dejavu.appbase.io/',
				},
				{
					title: 'Read more',
					href:
						'https://docs.appbase.io/docs/reactivesearch/v3/overview/importing/#importing-custom-data',
				},
			],
		},
		{
			title: 'UI Components',
			descriptions: [
				<React.Fragment>
					Add UI components for{' '}
					<a
						rel="noopener noreferrer"
						href="https://docs.appbase.io/docs/reactivesearch/v3/search/datasearch/"
						target="_blank"
					>
						Search
					</a>
					,{' '}
					<a
						rel="noopener noreferrer"
						href="https://docs.appbase.io/docs/reactivesearch/v3/list/singlelist/"
						target="_blank"
					>
						Lists
					</a>
					,{' '}
					<a
						rel="noopener noreferrer"
						href="https://docs.appbase.io/docs/reactivesearch/v3/range/singlerange/"
						target="_blank"
					>
						Ranges
					</a>
					, and{' '}
					<a
						rel="noopener noreferrer"
						href="https://docs.appbase.io/docs/reactivesearch/v3/result/reactivelist/"
						target="_blank"
					>
						Results
					</a>
					.
				</React.Fragment>,
				<React.Fragment>
					Or add in your own{' '}
					<a
						rel="noopener noreferrer"
						href="https://docs.appbase.io/docs/reactivesearch/v3/advanced/reactivecomponent/"
						target="_blank"
					>
						UI components
					</a>
					.
				</React.Fragment>,
			],
			links: [
				{
					title: 'COMPONENTS OVERVIEW',
					href: 'https://docs.appbase.io/docs/reactivesearch/v3/overview/components/',
				},
			],
		},
		{
			title: 'Tutorials',
			descriptions: [
				'Get a leg up by checking out these tutorials.',
				<React.Fragment>
					<li>
						<a
							rel="noopener noreferrer"
							href="https://codeburst.io/how-to-build-an-e-commerce-search-ui-with-react-and-elasticsearch-a581c823b2c3"
							target="_blank"
						>
							Building e-commerce search
						</a>
					</li>
					<li>
						<a
							rel="noopener noreferrer"
							href="https://medium.appbase.io/how-to-build-a-movie-search-app-with-react-and-elasticsearch-2470f202291c"
							target="_blank"
						>
							Building Movie Search
						</a>
					</li>
					<li>
						<a
							rel="noopener noreferrer"
							href="https://medium.appbase.io/how-to-build-a-github-search-ui-in-60-minutes-295109211c70"
							target="_blank"
						>
							Building a Github Explorer
						</a>
					</li>
				</React.Fragment>,
			],
			links: [
				{
					title: 'Read more tutorials',
					href: 'https://medium.appbase.io/tagged/appbase',
				},
			],
		},
		{
			title: 'ReactiveSearch for <X>',
			descriptions: [
				'ReactiveSearch is also available for:',
				<React.Fragment>
					<li>
						<a
							rel="noopener noreferrer"
							href="https://docs.appbase.io/docs/reactivesearch/native/overview/QuickStart/"
							target="_blank"
						>
							React Native
						</a>
					</li>
					<li>
						<a
							rel="noopener noreferrer"
							href="https://docs.appbase.io/docs/reactivesearch/vue/overview/QuickStart/"
							target="_blank"
						>
							Vue.JS
						</a>
					</li>
					<li>
						<a
							rel="noopener noreferrer"
							href="https://docs.appbase.io/docs/reactivesearch/v3/overview/reactivemaps/"
							target="_blank"
						>
							Maps
						</a>
					</li>
				</React.Fragment>,
			],
		},
	],
	banner: [
		{
			backgroundColor: primary,
			title: 'Build a live app in 5 easy steps',
			description:
				'Go from scratch to creating a data-driven search app with our beginner friendly quick start guide.',
			button: {
				title: 'Get Started',
				href: '#',
			},
			link: {
				title: 'Docs',
				href: 'https://docs.appbase.io/',
			},
		},
		{
			backgroundColor: primaryDark,
			title: 'Get dedicated support',
			description:
				'We offer production support for ReactiveMaps. Work with us to bring your dream project to life.',
			button: {
				title: 'SUPPORT PLANS',
				href: 'https://appbase.io/support',
			},
			link: {
				title: 'Get in touch',
				href: 'https://appbase.io/contact',
			},
		},
	],
};
