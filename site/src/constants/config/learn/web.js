import React from 'react';
import theme from './../../theme/web';
import baseConfig from './../base/web';

const { primary, primaryDark } = theme;

export default {
	...baseConfig,
	title: 'Get Started with Reactive Search',
	description: (
		<React.Fragment>
			Use our step-by-step guide to learn all about Reactive Maps, or check out our{' '}
			<a
				rel="noopener noreferrer"
				href="https://opensource.appbase.io/reactive-manual/"
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
				'ReactiveMaps use Google Maps to render the map component. You can add the following script in the <head> element of your main .html file.',
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
					href: 'https://opensource.appbase.io/reactive-manual/getting-started/reactivemaps.html',
				},
			],
		},
		{
			title: 'Connect to your ES index',
			descriptions: [
				'ReactiveMaps use Google Maps to render the map component. You can add the following script in the <head> element of your main .html file.',
			],
		},
		{
			title: 'Create or import dataset',
			descriptions: [
				'ReactiveMaps use Google Maps to render the map component. You can add the following script in the <head> element of your main .html file.',
			],
			links: [
				{
					title: 'DEJAVU',
					href: 'https://opensource.appbase.io/reactive-manual/getting-started/reactivemaps.html',
				},
				{
					title: 'IMPORT DATA',
					href: 'https://opensource.appbase.io/reactive-manual/getting-started/reactivemaps.html',
				},
			],
		},
		{
			title: 'UI Components',
			descriptions: [
				'ReactiveMaps use Google Maps to render the map component. You can add the following script in the <head> element of your main .html file.',
			],
			links: [
				{
					title: 'COMPONENT DOCS',
					href: 'https://opensource.appbase.io/reactive-manual/getting-started/reactivemaps.html',
				},
			],
		},
		{
			title: 'Maps for React Native',
			descriptions: [
				'ReactiveMaps use Google Maps to render the map component. You can add the following script in the <head> element of your main .html file.',
			],
			links: [
				{
					title: 'QUICK START WITH REACT NATIVE',
					href: 'https://opensource.appbase.io/reactive-manual/getting-started/reactivemaps.html',
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
				href: 'https://opensource.appbase.io/reactive-manual/getting-started/reactivesearch.html',
			},
			link: {
				title: 'Learn More',
				href: 'https://opensource.appbase.io/reactive-manual',
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
				href: 'https://appbase.io/contactus',
			},
		},
	],
};
