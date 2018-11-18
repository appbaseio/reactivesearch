import theme from './../../theme/native';
import baseConfig from './../base/native';

const { primary, primaryDark } = theme;

const baseConfigHeader = {
	...baseConfig.header,
	links: [
		{
			description: 'vue',
			href: '/reactivesearch/vue',
		},
		...baseConfig.header.links,
	],
};
export default {
	...baseConfig,
	name: 'native',
	header: baseConfigHeader,
	banner1: {
		title: 'React Native UI components for Elasticsearch',
		description: 'Build data-driven mobile apps. Open-source licensed.',
		image: {
			src: '/images/native/landing.png',
			alt: 'Native Components',
		},
		button: {
			title: 'Get Started',
			href:
				'https://opensource.appbase.io/reactive-manual/native/getting-started/reactivesearch.html',
		},
		link: {
			title: 'LEARN MORE',
			href: '/native/learn',
		},
	},
	banner2: {
		image: {
			src: '/images/native/components.png',
			alt: 'Components',
			mobile: {
				src: '/images/native/components.png',
				srcSet: '/images/native/components.png',
			},
		},
		title: 'UI Components for every occasion',
		description:
			'Build the perfect search experience using our UI components or by creating your own. Over 10 prebuilt components with customizable queries and configurable styles.',
		button: {
			title: 'View Components',
			href: 'https://opensource.appbase.io/reactive-manual/native/components/textfield.html',
		},
		link: {
			title: 'Create your own',
			href: 'https://opensource.appbase.io/reactive-manual/native/advanced/reactivecomponent.html',
		},
		sketch: {
			href: 'resources/ReactiveSearchNative_Playground.sketch',
		},
		style: {
			paddingLeft: '20px',
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
					'Well-designed and performance optimized UI components.Ship faster and solve fewer edge cases.',
				href:
					'https://medium.appbase.io/build-your-next-react-native-app-with-reactivesearch-ce21829f3bf5',
			},
			{
				image: {
					src: 'icons/1.png',
					alt: 'Icon',
				},
				title: 'Works with existing UIs',
				description: 'Already have your own components? Bring them to Reactivesearch Native.',
				href:
					'https://opensource.appbase.io/reactive-manual/native/advanced/reactivecomponent.html',
			},
			{
				image: {
					src: 'icons/2.png',
					alt: 'Icon',
				},
				title: 'Configurable styles',
				description: 'Styled components with rich theming and style injection support.',
				href: 'https://opensource.appbase.io/reactive-manual/native/advanced/style.html',
			},
			{
				image: {
					src: 'icons/3.png',
					alt: 'Icon',
				},
				title: 'Create cross-platform apps',
				description:
					'All Native components have equivalent React UI components, allowing creation of consistent cross-platform apps.',
				href: 'https://github.com/appbaseio/reactivesearch/tree/dev/packages/web',
			},
			{
				image: {
					src: 'icons/4.png',
					alt: 'Icon',
				},
				title: 'Elasticsearch compatible',
				description: 'Connect to an ES index hosted anywhere. Supports v2, v5 and v6.',
				href:
					'https://opensource.appbase.io/reactive-manual/getting-started/native/reactivebase.html',
			},
			{
				image: {
					src: 'icons/5.png',
					alt: 'Icon',
				},
				title: 'Customizable queries',
				description:
					'Components come with good query defaults, that can be customized with Elasticsearch query DSL.',
				href: 'https://opensource.appbase.io/reactive-manual/advanced/customquery.html',
			},
			{
				image: {
					src: 'images/shield.png',
					alt: 'Icon',
				},
				title: 'Easy to secure',
				description:
					'Use appbase.io to get read-only credentials, or set up a middleware proxy with authorization rules.',
				href:
					'https://opensource.appbase.io/reactive-manual/native/getting-started/reactivebase.html#connect-to-elasticsearch',
			},
			{
				image: {
					src: 'images/blocks.png',
					alt: 'Icon',
				},
				title: 'Starter apps',
				description: 'Get started quickly by using any of our pre-configured starter apps.',
				href: '/native#examples',
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
			title: 'Build a live app in 5 esay steps',
			description:
				'Go from scratch to creating a data-driven Maps application with our quickstart guide for beginners.',
			button: {
				title: 'Get Started',
				href: 'https://opensource.appbase.io/reactive-manual/getting-started/reactivesearch.html',
			},
			link: {
				title: 'Learn More',
				href: '/native/learn',
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
	banner6: {
		title: 'Check our demos',
		demos: [
			{
				src: 'images/native/booksearch.png',
				title: 'Book Search',
				href: 'https://snack.expo.io/@metagrover/booksearch',
			},
			{
				src: 'images/native/gitxplore.png',
				title: 'GitHub Search',
				href: 'https://snack.expo.io/@dhruvdutt/gitxplore-native-app',
			},
			{
				src: 'images/native/todo.png',
				title: 'Todo',
				href: 'https://snack.expo.io/@dhruvdutt/todo',
			},
		],
	},
};
