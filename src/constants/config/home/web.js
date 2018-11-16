import theme from './../../theme/web';
import baseConfig from './../base/web';

const { primary, primaryDark } = theme;

const baseConfigHeader = {
	...baseConfig.header,
	links: [
		{
			description: 'vue',
			href: '/vue',
		},
		...baseConfig.header.links,
	],
};
export default {
	...baseConfig,
	header: baseConfigHeader,
	banner1: {
		title: 'React UI components for Elasticsearch',
		description: 'Now more configurable, lighter and performant.Open source licensed.',
		image: {
			src: './../images/browser.png',
			alt: 'Reactive Search Components',
		},
		button: {
			title: 'Get Started',
			href: 'https://opensource.appbase.io/reactive-manual/getting-started/reactivesearch.html',
		},
		link: {
			title: 'LEARN MORE',
			href: '/learn',
		},
	},
	banner2: {
		image: {
			src: 'images/components.png',
			alt: 'Components',
			mobile: {
				src: 'images/components.png',
				srcSet: 'images/components.png',
			},
		},
		title: 'UI Components for every occasion',
		description:
			'Build the perfect search experience using our UI components or by creating your own.30+ prebuilt components with customizable queries and configurable styles.',
		button: {
			title: 'View Components',
			href: 'https://opensource.appbase.io/reactive-manual/base-components/textfield',
		},
		link: {
			title: 'Create your own',
			href: 'https://opensource.appbase.io/reactive-manual/advanced/reactivecomponent',
		},
		sketch: {
			href:
				'https://opensource.appbase.io/reactivesearch/resources/ReactiveSearchNative_Playground.sketch',
		},
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
					'30+ well-designed and performance optimized UI components.Ship faster and solve fewer edge cases.',
				href: 'https://medium.com/@siddharthlatest/v2-ui-components-for-elasticsearch-23743d9a1070',
			},
			{
				image: {
					src: 'icons/1.png',
					alt: 'Data-driven UIs',
				},
				title: 'Works with existing UIs',
				description: 'Already have your own components? Bring them to ReactiveSearch.',
				href: 'https://opensource.appbase.io/reactive-manual/advanced/reactivecomponent.html',
			},
			{
				image: {
					src: 'icons/2.png',
					alt: 'Data-driven UIs',
				},
				title: 'Configurable styles',
				description: 'Styled components with rich theming and css class-injection support.',
				href: 'https://opensource.appbase.io/reactive-manual/theming/themes.html',
			},
			{
				image: {
					src: 'icons/3.png',
					alt: 'Data-driven UIs',
				},
				title: 'Create cross-platform apps',
				description: 'Reactivesearch components can be ported to create native mobile UIs.',
				href: 'https://github.com/appbaseio/reactivesearch/tree/dev/packages/native',
			},
			{
				image: {
					src: 'icons/4.png',
					alt: 'Data-driven UIs',
				},
				title: 'Elasticsearch compatible',
				description: 'Connect to an ES index hosted anywhere. Supports v2, v5 and v6.',
				href: 'https://opensource.appbase.io/reactive-manual/getting-started/reactivebase.html',
			},
			{
				image: {
					src: 'icons/5.png',
					alt: 'Data-driven UIs',
				},
				title: 'Customizable queries',
				description:
					'Components come with good query defaults, that can be customized with Elasticsearch query DSL.',
				href: 'https://opensource.appbase.io/reactive-manual/advanced/customquery.html',
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
			title: 'Build a live app in 5 easy steps',
			description:
				'Go from scratch to creating a data-driven Maps application with our quick start guide for beginners.',
			button: {
				title: 'Get Started',
				href: 'https://opensource.appbase.io/reactive-manual/getting-started/reactivesearch.html',
			},
			link: {
				title: 'Learn More',
				href: '/learn',
			},
		},
		{
			backgroundColor: primaryDark,
			title: 'Get dedicated support',
			description:
				'We offer production support for ReactiveSearch. Work with us to bring your dream project to life.',
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
	banner6: {
		title: 'Check our demos',
		button: {
			title: 'See more',
			href: '/demo',
		},
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
			// {
			// 	src: 'images/apps/goodbooks.png',
			// 	title: 'Book Search',
			// 	href: 'https://opensource.appbase.io/reactivesearch/demos/goodbooks/',
			// 	description: '',
			// },
			// {
			// 	src: 'images/apps/technews.png',
			// 	title: 'Tech News Search',
			// 	href: 'https://opensource.appbase.io/reactivesearch/demos/technews/',
			// 	description: '',
			// },
		],
	},
};
