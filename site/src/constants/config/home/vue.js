import theme from './../../theme/vue';
import baseConfig from './../base/vue';

const { primary, primaryDark } = theme;

const baseConfigHeader = {
	...baseConfig.header,
	links: [
		// {
		// 	description: 'examples',
		// 	href: '#examples',
		// },
		...baseConfig.header.links,
	],
};
export default {
	name: 'vue',
	...baseConfig,
	header: baseConfigHeader,
	banner1: {
		title: 'Vue.js UI components for Elasticsearch',
		description: 'Now more configurable, lighter and performant.Open source licensed.',
		image: {
			src: 'images/vue/Hero.png',
			alt: 'Reactive Search Components',
		},
		button: {
			title: 'Get Started',
			href: 'https://opensource.appbase.io/reactive-manual/vue/getting-started/reactivesearch.html',
		},
		link: {
			title: 'LEARN MORE',
			href: '/vue/learn',
		},
	},
	banner2: {
		image: {
			src: 'images/vue/components.png',
			alt: 'Components',
			mobile: {
				src: 'images/vue/components.png',
			},
		},
		title: 'UI Components for every occasion',
		description:
			'Build the perfect search experience using our UI components or by creating your own.30+ prebuilt components with customizable queries and configurable styles.',
		button: {
			title: 'View Components',
			href: 'https://opensource.appbase.io/reactive-manual/vue/base-components/selectedfilters.html',
		},
		link: {
			title: 'Create your own',
			href: 'https://opensource.appbase.io/reactive-manual/vue/advanced/reactivecomponent.html',
		},
		// sketch: {
		// 	href:
		// 		'https://opensource.appbase.io/reactivesearch/resources/ReactiveSearchNative_Playground.sketch',
		// },
	},
	banner3: {
		title: 'Up to 10x Time Savings',
		description: 'Focus on design and user experience, let us handle the details.',
		cards: [
			{
				image: {
					src: 'images/rocket.png',
					alt: 'Data-driven UIs',
				},
				title: 'Launch and iterate faster',
				description:
					'10+ well-designed and performance optimized UI components.Ship faster and solve fewer edge cases.',
				href: 'https://opensource.appbase.io/reactive-manual/vue/',
			},
			{
				image: {
					src: 'images/remix.png',
					alt: 'Data-driven UIs',
				},
				title: 'Works with existing UIs',
				description: 'Already have your own components? Bring them to ReactiveSearch.',
				href: 'https://opensource.appbase.io/reactive-manual/vue/advanced/reactivecomponent.html',
			},
			{
				image: {
					src: 'icons/2.png',
					alt: 'Data-driven UIs',
				},
				title: 'Configurable styles',
				description: 'Styled components with rich theming and css class-injection support.',
				href: 'https://opensource.appbase.io/reactive-manual/vue/theming/style.html',
			},
			{
				image: {
					src: 'icons/4.png',
					alt: 'Data-driven UIs',
				},
				title: 'Elasticsearch compatible',
				description: 'Connect to an ES index hosted anywhere. Supports v2, v5 and v6.',
				href: 'https://opensource.appbase.io/reactive-manual/vue/getting-started/reactivesearch.html',
			},
			{
				image: {
					src: 'icons/5.png',
					alt: 'Data-driven UIs',
				},
				title: 'Customizable queries',
				description:
					'Components come with good query defaults, that can be customized with Elasticsearch query DSL.',
				href: 'https://opensource.appbase.io/reactive-manual/vue/advanced/customquery.html',
			},
			{
				image: {
					src: 'images/shield.png',
					alt: 'Easy to secure',
				},
				title: 'Easy to secure',
				description:
					'Use appbase.io to get read-only credentials, or set up a middleware proxy with authorization rules.',
				href: 'https://appbase.io',
			},
		],
	},
	banner4: {
		title: 'Write Less Code',
		description: `Reactivesearch handles UI rendering, query requests and manages
		response state so you can focus on the product experience,
		ship faster and iterate quicker.`,
	},
	banner5: [
		{
			backgroundColor: primary,
			title: 'Build a live app in 5 minutes',
			description:
				'Go from scratch to creating a data-driven Maps application with our quick start guide for beginners.',
			button: {
				title: 'Get Started',
				href: 'https://opensource.appbase.io/reactive-manual/vue/getting-started/reactivesearch.html',
			},
			link: {
				title: 'Learn More',
				href: 'https://opensource.appbase.io/reactive-manual/vue',
			},
		},
		{
			backgroundColor: primaryDark,
			title: 'Work with us to build your app.',
			description:
				"We work with teams of all sizes to set up Apollo and GraphQL to fit their specific needs. Let us know what you're building and we'll see how we can help.",
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
	// banner6: {
	// 	title: 'Check our demos',
	// 	button: {
	// 		title: 'See more',
	// 		href: '/reactivemaps/demos',
	// 	},
	// 	demos: [
	// 		{
	// 			src: 'images/apps/airbeds.png',
	// 			title: 'Airbeds',
	// 			href: 'https://opensource.appbase.io/reactivesearch/demos/airbeds/',
	// 			description: 'An airbnb inspired app for browsing housing areas in Seattle',
	// 		},
	// 		{
	// 			src: 'images/apps/productsearch.png',
	// 			title: 'Product Search',
	// 			href: 'https://opensource.appbase.io/reactivesearch/demos/producthunt/',
	// 			description: '',
	// 		},
	// 		{
	// 			src: 'images/apps/gitxplore.png',
	// 			title: 'GitHub Search',
	// 			href: 'https://opensource.appbase.io/reactivesearch/demos/gitxplore/',
	// 			description: '',
	// 		},
	// 		{
	// 			src: 'images/apps/carstore.png',
	// 			title: 'Car Store',
	// 			href: 'https://opensource.appbase.io/reactivesearch/demos/ecommerce/',
	// 			description: '',
	// 		},
	// 	],
	// },
};
