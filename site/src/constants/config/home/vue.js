import theme from '../../theme/vue';
import baseConfig from '../base/vue';

const { primary, primaryDark } = theme;

const baseConfigHeader = {
	...baseConfig.header,
	links: [
		{
			description: 'examples',
			href: '#examples',
		},
		...baseConfig.header.links,
	],
};
export default {
	name: 'vue',
	...baseConfig,
	header: baseConfigHeader,
	banner1: {
		title: 'Vue + ElasticSearch = ❤️',
		description: 'UI components for building data-driven search experiences.',
		image: {
			src: '../../reactivesearch/images/vue/Hero.png',
			alt: 'Reactive Search Components',
		},
		button: {
			title: 'Get Started',
			href: './quickstart',
		},
		link: {
			title: 'LEARN MORE',
			href: 'https://docs.appbase.io/docs/reactivesearch/vue/overview/QuickStart/',
		},
	},
	banner2: {
		image: {
			src: '../../reactivesearch/images/vue/components.png',
			alt: 'Components',
			mobile: {
				src: '../../reactivesearch/images/vue/components.png',
			},
		},
		title: 'UI Components for every occasion',
		description:
			'Build the perfect search experience using our UI components or by creating your own. Over 10 prebuilt components with customizable queries and configurable styles.',
		button: {
			title: 'View Components',
			href: 'https://docs.appbase.io/docs/reactivesearch/vue/overview/Components/',
		},
		link: {
			title: 'Creating your components',
			href: 'https://docs.appbase.io/docs/reactivesearch/vue/advanced/ReactiveComponent/',
		},
		sketch: {
			href:
				'https://opensource.appbase.io/reactivesearch/resources/ReactiveSearch_Playground.sketch',
		},
	},
	banner3: {
		title: 'Up to 10x Time Savings',
		description: 'Focus on design and user experience as ReactiveSearch handles the details.',
		cards: [
			{
				image: {
					src: '../../reactivesearch/images/rocket.png',
					alt: 'Data-driven UIs',
				},
				title: 'Launch and iterate faster',
				description:
					'10+ well-designed and performance optimized UI components. Ship faster and solve fewer edge cases.',
				href: 'https://docs.appbase.io/docs/reactivesearch/vue/overview/Components/',
			},
			{
				image: {
					src: '../../reactivesearch/images/remix.png',
					alt: 'Data-driven UIs',
				},
				title: 'Works with existing UIs',
				description: 'Already have your own components? Bring them to ReactiveSearch.',
				href: 'https://docs.appbase.io/docs/reactivesearch/vue/advanced/ReactiveComponent/',
			},
			{
				image: {
					src: '../../reactivesearch/icons/2.png',
					alt: 'Data-driven UIs',
				},
				title: 'Configurable styles',
				description: 'Styled components with rich theming and css class-injection support.',
				href: 'https://docs.appbase.io/docs/reactivesearch/vue/theming/Style/',
			},
			{
				image: {
					src: '../../reactivesearch/icons/4.png',
					alt: 'Data-driven UIs',
				},
				title: 'Elasticsearch compatible',
				description: 'Connect to an ES index hosted anywhere. Supports v2, v5 and v6.',
				href: 'https://docs.appbase.io/docs/reactivesearch/vue/overview/QuickStart/',
			},
			{
				image: {
					src: '../../reactivesearch/icons/5.png',
					alt: 'Data-driven UIs',
				},
				title: 'Customizable queries',
				description:
					'Components come with good query defaults, that can be customized with Elasticsearch query DSL.',
				href: 'https://docs.appbase.io/docs/reactivesearch/vue/advanced/CustomQueries/',
			},
			{
				image: {
					src: '../../reactivesearch/images/shield.png',
					alt: 'Easy to secure',
				},
				title: 'Easy to secure',
				description:
					'Use appbase.io to get security out of the box, or set up a middleware proxy with authorization rules.',
				href:
					'https://docs.appbase.io/docs/reactivesearch/vue/overview/ReactiveBase/#connect-to-elasticsearch',
			},
		],
	},
	banner5: [
		{
			backgroundColor: primary,
			title: 'Build a live app in 5 minutes',
			description:
				'Go from scratch to creating a data-driven search app with our beginner friendly quick start guide.',
			button: {
				title: 'Get Started',
				href: './quickstart',
			},
			link: {
				title: 'Docs',
				href: 'https://docs.appbase.io/docs/reactivesearch/vue/overview/QuickStart/',
			},
		},
		{
			backgroundColor: primaryDark,
			title: 'Get dedicated support',
			description:
				'We offer production support for ReactiveSearch. Work with us to bring your dream project to life.',
			button: {
				title: 'SUPPORT PLANS',
				href: 'https://appbase.io/pricing#support',
			},
			link: {
				title: 'Get in touch',
				href: 'https://appbase.io/contact',
			},
		},
	],
	banner6: {
		title: 'Check starter apps',
		demos: [
			{
				src: '../../reactivesearch/images/apps/gitxplore.png',
				title: 'GitHub Search',
				href: 'https://codesandbox.io/s/54l2m5rqxl',
				description:
					'Explore top 30K Github repositories by various filters like stars, forks, and topics.',
			},
			{
				src: '../../reactivesearch/images/apps/goodbooks.png',
				title: 'Book Search',
				href: 'https://codesandbox.io/s/y2rvj53koz/',
				description: 'An e-commerce search experience for a books dataset.',
			},
			{},
		],
	},
	banner7: {
		title: 'Featured Posts',
		articles: [
			{
				src: 'https://cdn-images-1.medium.com/max/2000/1*o4yRyTm2pKfa_Flr3W2TPw.png',
				title: 'Vue.JS Components for building Search UIs',
				href:
					'https://medium.appbase.io/vue-js-components-for-building-search-uis-7b2a1b6fe159',
				description: 'Introductory article for Reactivesearch Vue.',
			},
			{
				src: 'https://cdn-images-1.medium.com/max/2000/1*xX5Q917ujpQsdZp-gy72zw.png',
				title: 'How to Build BookSearch App using Vue.js and ElasticSearch',
				href:
					'https://medium.appbase.io/building-booksearch-application-using-vue-and-elasticsearch-a39615f4d6b3',
				description:
					'A 101 post showing how to build real world apps with ReactiveSearch Vue.',
			},
			{
				src: 'https://cdn-images-1.medium.com/max/1000/1*906R2mDgLnoatUtK6PeQ8g.png',
				title: 'How to Build A Gitxplore Search UI',
				href:
					'https://medium.appbase.io/learn-how-to-build-a-github-search-explorer-app-with-vue-js-c66f61d6e152',
				description:
					'A 101 post showing how to build a data-driven search UI with ReactiveSearch Vue.',
			},
		],
	},
};
