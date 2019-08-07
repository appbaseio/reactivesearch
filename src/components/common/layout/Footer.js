import React from 'react';
import { AppFooter } from '@appbaseio/designkit';

const Footer = () => (
	<AppFooter
		linksConfig={[
			{
				title: 'Products',
				list: [
					{
						title: 'Apps',
						href: '/apps',
					},
					{
						title: 'Clusters',
						href: '/clusters',
					},
					{
						title: 'Tools',
						href: '/tools',
					},
				],
			},
			{
				title: 'Features',
				list: [
					{
						title: 'Search Preview',
						href: '/features/search',
					},
					{
						title: 'Analytics',
						href: '/features/analytics',
					},
					{
						title: 'Security',
						href: '/features/security',
					},
					{
						title: 'Apps vs Clusters',
						href: '/features/price-comparison',
					},
				],
			},
			{
				title: 'Use Cases',
				list: [
					{
						title: 'Realtime Search',
						href: '/usecases/realtime-search',
					},
					{
						title: 'Geo Apps',
						href: '/usecases/geo-apps',
					},
					{
						title: 'Feeds',
						href: '/usecases/feeds',
					},
					{
						title: 'Why Appbase.io',
						href: '/usecases/why-appbase',
					},
				],
			},
			{
				title: 'Docs',
				list: [
					{
						title: 'JS Quick Start',
						href: 'http://docs.appbase.io/javascript/quickstart.html',
						openWithTab: true,
					},
					{
						title: 'JS API Reference',
						href: 'https://docs.appbase.io/javascript/api-reference.html',
						openWithTab: true,
					},
					{
						title: 'REST APIs',
						href: 'https://rest.appbase.io',
						openWithTab: true,
					},
				],
			},
			{
				title: 'Company',
				list: [
					{
						title: 'Terms of Service',
						href: '/tos',
					},
					{
						title: 'Privacy Policy',
						href: '/privacy',
					},
					{
						title: 'Cookies Policy',
						href: '/cookie',
					},
				],
			},
		]}
	/>
);

export default Footer;
