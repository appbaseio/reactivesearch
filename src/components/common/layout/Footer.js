import React from 'react';
import { AppFooter } from '@appbaseio/designkit';

const Footer = () => (
	<div className="footer">
		<AppFooter
			linksConfig={[
				{
					title: 'Product',
					list: [
						{
							title: 'Relevant Search',
							openWithTab: true,
							href: 'https://appbase.io/product/search',
						},
						{
							title: 'Actionable Analytics',
							openWithTab: true,
							href: 'https://appbase.io/product/analytics',
						},
						{
							title: 'Access Control',
							openWithTab: true,
							href: 'https://appbase.io/product/access-control',
						},
						{
							title: 'Search UI',
							openWithTab: true,
							href: 'https://appbase.io/product/search-ui/',
						},

					],
				},
				{
					title: 'Integrations',
					list: [
						{
							title: 'AWS Elasticsearch',
							openWithTab: true,
							href: 'https://appbase.io/solutions/aws-elasticsearch',
						},
						{
							title: 'Heroku',
							openWithTab: true,
							href: 'https://appbase.io/solutions/heroku-elasticsearch',
						},
						{
							title: 'Docker',
							openWithTab: true,
							href: 'https://appbase.io/solutions/elasticsearch-with-docker',
						},
						{
							title: 'Kubernetes',
							openWithTab: true,
							href: 'https://appbase.io/solutions/elasticsearch-with-kubernetes',
						},
					],
				},
				{
					title: 'Use Cases',
					list: [
						{
							title: 'E-Commerce',
							openWithTab: true,
							href: 'https://appbase.io/solutions/ecommerce-search',
						},
						{
							title: 'SaaS Search',
							openWithTab: true,
							href: 'https://appbase.io/solutions/saas-search/',
						},
						{
							title: 'Geo Apps',
							openWithTab: true,
							href: 'https://appbase.io/usecases/geo-apps',
						},
						{
							title: 'Mobile Search',
							openWithTab: true,
							href: 'https://appbase.io/usecases/mobile-search/',
						},
						{
							title: 'Realtime Search',
							openWithTab: true,
							href: 'https://appbase.io/usecases/realtime-search',
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
