import theme from './../../theme/native';
import baseConfig from './../base/native';

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
	...baseConfig,
	name: 'native',
	header: baseConfigHeader,
	banner1: {
		title: 'React Native UI Components for ElasticSearch',
		description: 'Build data-driven search experiences for iOS and Android apps.',
		image: {
			src: '../../reactivesearch/images/native/landing.png',
			alt: 'Native Components',
		},
		button: {
			title: 'Get Started',
			href: './quickstart',
		},
		link: {
			title: 'Docs',
			href: 'https://docs.appbase.io/docs/reactivesearch/native/overview/QuickStart/',
		},
	},
	banner2: {
		image: {
			src: '../../reactivesearch/images/native/components.png',
			alt: 'Components',
			mobile: {
				src: '../../reactivesearch/images/native/components.png',
				srcSet: '../../reactivesearch/images/native/components.png',
			},
		},
		title: 'UI Components for every occasion',
		description:
			'Build the perfect search experience using our UI components or by creating your own. Over 10 prebuilt components with customizable queries and configurable styles.',
		button: {
			title: 'View Components',
			href: 'https://docs.appbase.io/docs/reactivesearch/native/components/TextField/',
		},
		link: {
			title: 'Creating your components',
			href: 'https://docs.appbase.io/docs/reactivesearch/native/advanced/ReactiveComponent/',
		},
		sketch: {
			href: '../../resources/ReactiveSearchNative_Playground.sketch',
		},
		style: {
			paddingLeft: '20px',
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
					'Well-designed and performance optimized UI components. Ship faster and solve fewer edge cases.',
				href:
					'https://medium.appbase.io/build-your-next-react-native-app-with-reactivesearch-ce21829f3bf5',
			},
			{
				image: {
					src: '../../reactivesearch/icons/1.png',
					alt: 'Icon',
				},
				title: 'Works with existing UIs',
				description:
					'Already have your own components? Bring them to Reactivesearch Native.',
				href:
					'https://docs.appbase.io/docs/reactivesearch/native/advanced/ReactiveComponent/',
			},
			{
				image: {
					src: '../../reactivesearch/icons/2.png',
					alt: 'Icon',
				},
				title: 'Configurable styles',
				description: 'Styled components with rich theming and style injection support.',
				href: 'https://docs.appbase.io/docs/reactivesearch/native/advanced/Style/',
			},
			{
				image: {
					src: '../../reactivesearch/icons/3.png',
					alt: 'Icon',
				},
				title: 'Create cross-platform apps',
				description:
					'All Native components have equivalent React UI components, allowing creation of consistent cross-platform apps.',
				href: 'https://github.com/appbaseio/reactivesearch/tree/dev/packages/web',
			},
			{
				image: {
					src: '../../reactivesearch/icons/4.png',
					alt: 'Icon',
				},
				title: 'Elasticsearch compatible',
				description: 'Connect to an ES index hosted anywhere. Supports v2, v5 and v6.',
				href: 'https://docs.appbase.io/docs/reactivesearch/native/overview/ReactiveBase/',
			},
			{
				image: {
					src: '../../reactivesearch/icons/5.png',
					alt: 'Icon',
				},
				title: 'Customizable queries',
				description:
					'Components come with good query defaults, that can be customized with Elasticsearch query DSL.',
				href:
					'https://docs.appbase.io/docs/reactivesearch/native/advanced/Guides/#custom-queries',
			},
		],
	},
	banner5: [
		{
			backgroundColor: primary,
			title: 'Build a live app in 5 easy steps',
			description:
				'Go from scratch to creating a data-driven search app with our beginner friendly quick start guide.',
			button: {
				title: 'Get Started',
				href: '../../reactivesearch/native/quickstart',
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
		title: 'Check our demos',
		demos: [
			{
				src: '../../reactivesearch/images/native/booksearch.png',
				title: 'Book Search',
				href: 'https://snack.expo.io/@lakhansamani/booksearch',
			},
			{
				src: '../../reactivesearch/images/native/gitxplore.png',
				title: 'GitHub Search',
				href: 'https://snack.expo.io/@lakhansamani/gitxplore-native-app',
			},
			{
				src: '../../reactivesearch/images/native/earthquake_reporter.png',
				title: 'Earthquake Reporter',
				href: 'https://snack.expo.io/@lakhansamani/earthquake-reporter',
			},
		],
	},
};
