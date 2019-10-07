import React from 'react';
import theme from './../../theme/native';
import baseConfig from './../base/native';

const { primary, primaryDark } = theme;

export default {
	...baseConfig,
	title: 'Get Started with Reactive Search',
	description: (
		<React.Fragment>
			Use our step-by-step guide to learn all about ReactiveSearch for React Native, or check
			out our{' '}
			<a
				rel="noopener noreferrer"
				href="https://docs.appbase.io/docs/reactivesearch/native/overview/QuickStart/"
				target="_blank"
			>
				docs
			</a>
			.
		</React.Fragment>
	),
	installationSteps: [
		{
			title: 'Install ReactiveSearch Native',
			descriptions: [
				'ReactiveSearch Native is a set of React Native UI components for building data-driven UIs with ElasticSearch.',
			],
			codes: ['npm install @appbaseio/reactivesearch-native'],
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
					href:
						'https://docs.appbase.io/docs/reactivesearch/native/overview/ReactiveBase/',
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
						'https://docs.appbase.io/docs/reactivesearch/native/overview/Importing/#importing-custom-data',
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
						href="https://docs.appbase.io/docs/reactivesearch/native/components/DataSearch/"
						target="_blank"
					>
						Search
					</a>
					,{' '}
					<a
						rel="noopener noreferrer"
						href="https://docs.appbase.io/docs/reactivesearch/native/components/SingleDropdownList/"
						target="_blank"
					>
						Lists
					</a>
					,{' '}
					<a
						rel="noopener noreferrer"
						href="https://docs.appbase.io/docs/reactivesearch/native/components/SingleDropdownRange/"
						target="_blank"
					>
						Ranges
					</a>
					, and{' '}
					<a
						rel="noopener noreferrer"
						href="https://docs.appbase.io/docs/reactivesearch/native/components/ReactiveList/"
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
						href="https://docs.appbase.io/docs/reactivesearch/native/advanced/ReactiveComponent/"
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
					href: 'https://docs.appbase.io/docs/reactivesearch/native/overview/Components/',
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
							href="https://hackernoon.com/building-an-e-commerce-search-app-with-react-native-2c87760a2315"
							target="_blank"
						>
							Building an e-commerce search
						</a>
					</li>
					<li>
						<a
							rel="noopener noreferrer"
							href="https://medium.freecodecamp.org/how-to-build-a-real-time-todo-app-with-react-native-19a1ce15b0b3"
							target="_blank"
						>
							Building a todo list
						</a>
					</li>
					<li>
						<a
							rel="noopener noreferrer"
							href="https://medium.freecodecamp.org/how-to-build-a-nested-drawer-menu-with-react-native-a1c2fdcab6c9"
							target="_blank"
						>
							Kitchen Sink App
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
							href="https://docs.appbase.io/docs/reactivesearch/v3/overview/quickstart/"
							target="_blank"
						>
							React
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
				title: 'Learn More',
				href: 'https://docs.appbase.io/docs/reactivesearch/native/overview/QuickStart/',
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
