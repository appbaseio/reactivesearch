import React from 'react';
import theme from './../../theme/native';
import baseConfig from './../base/native';

const { primary, primaryDark } = theme;

export default {
	...baseConfig,
	title: 'Get Started with Reactive Search',
	description: (
		<React.Fragment>
			Use our step-by-step guide to learn all about Reactive Maps, or check out our{' '}
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
			title: 'Install Reactive X',
			descriptions: [
				'ReactiveSearch is a set of Elasticsearch components for building data-driven UIs.',
				'ReactiveMaps is an extension of ReactiveSearch that provides map focused UI components.',
			],
			codes: ['npm install @appbaseio/reactivesearch', 'npm install @appbaseio/reactivemaps'],
		},
		{
			title: 'Add Google Maps JS',
			descriptions: [
				'ReactiveMaps use Google Maps to render the map component. You can add the following script in the &lt;head&gt; element of your main .html file.',
				<React.Fragment>
					Get the{' '}
					<a
						rel="noopener noreferrer"
						href="https://developers.google.com/maps/documentation/javascript/get-api-key"
						target="_blank"
					>
						API Key
					</a>{' '}
					and info on how to add the Maps script.
				</React.Fragment>,
			],
			links: [
				{
					title: 'Step-by-step installation guide',
					href: 'https://docs.appbase.io/docs/reactivesearch/v3/overview/reactivemaps/',
				},
			],
		},
		{
			title: 'Connect to your ES index',
			descriptions: [
				'ReactiveMaps use Google Maps to render the map component. You can add the following script in the &lt;head&gt; element of your main .html file.',
			],
		},
		{
			title: 'Create or import dataset',
			descriptions: [
				'ReactiveMaps use Google Maps to render the map component. You can add the following script in the &lt;head&gt; element of your main .html file.',
			],
			links: [
				{
					title: 'DEJAVU',
					href: 'https://dejavu.appbase.io/',
				},
				{
					title: 'IMPORT DATA',
					href: 'https://importer.appbase.io/',
				},
			],
		},
		{
			title: 'UI Components',
			descriptions: [
				'ReactiveMaps use Google Maps to render the map component. You can add the following script in the &lt;head&gt; element of your main .html file.',
			],
			links: [
				{
					title: 'COMPONENT DOCS',
					href: 'https://docs.appbase.io/docs/reactivesearch/v3/map/geodistanceslider/',
				},
			],
		},
		{
			title: 'Maps for React Native',
			descriptions: [
				'ReactiveMaps use Google Maps to render the map component. You can add the following script in the &lt;head&gt; element of your main .html file.',
			],
			links: [
				{
					title: 'QUICK START WITH REACT NATIVE',
					href:
						'https://docs.appbase.io/docs/reactivesearch/native/overview/ReactiveMaps/',
				},
			],
		},
	],
	banner: [
		{
			backgroundColor: primary,
			title: 'Build a live app in 5 easy steps',
			description:
				'Go from scratch to creating a data-driven Maps application with our quickstart guide for beginners.',
			button: {
				title: 'Get Started',
				href: 'https://docs.appbase.io/docs/reactivesearch/v3/overview/quickstart/',
			},
			link: {
				title: 'Learn More',
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
