import React from 'react';
import { AppFooter } from '@appbaseio/designkit';

const Footer = () => (
	<div className="footer">
		<AppFooter
			linksConfig={[
				{
					title: 'Products',
					list: [
						{
							title: 'Apps',
							openWithTab: true,
							href: 'https://appbase.io/apps',
						},
						{
							title: 'Clusters',
							openWithTab: true,
							href: 'https://appbase.io/clusters',
						},
						{
							title: 'Tools',
							openWithTab: true,
							href: 'https://appbase.io/tools',
						},
					],
				},
				{
					title: 'Features',
					list: [
						{
							title: 'Search Preview',
							openWithTab: true,
							href: 'https://appbase.io/features/search',
						},
						{
							title: 'Analytics',
							openWithTab: true,
							href: 'https://appbase.io/features/analytics',
						},
						{
							title: 'Security',
							openWithTab: true,
							href: 'https://appbase.io/features/security',
						},
						{
							title: 'Apps vs Clusters',
							openWithTab: true,
							href: 'https://appbase.io/features/price-comparison',
						},
					],
				},
				{
					title: 'Use Cases',
					list: [
						{
							title: 'Realtime Search',
							openWithTab: true,
							href: 'https://appbase.io/usecases/realtime-search',
						},
						{
							title: 'Geo Apps',
							openWithTab: true,
							href: 'https://appbase.io/usecases/geo-apps',
						},
						{
							title: 'Feeds',
							openWithTab: true,
							href: 'https://appbase.io/usecases/feeds',
						},
						{
							title: 'Why Appbase.io',
							openWithTab: true,
							href: 'https://appbase.io/usecases/why-appbase',
						},
					],
				},
				{
					title: 'Company',
					list: [
						{
							title: 'Terms of Service',
							openWithTab: true,
							href: 'https://appbase.io/tos',
						},
						{
							title: 'Privacy Policy',
							openWithTab: true,
							href: 'https://appbase.io/privacy',
						},
						{
							title: 'Cookies Policy',
							openWithTab: true,
							href: 'https://appbase.io/cookie',
						},
					],
				},
			]}
		/>
	</div>
);

export default Footer;
