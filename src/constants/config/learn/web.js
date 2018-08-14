import theme from './../../theme/web';
import baseConfig from './../base/web';

const { primary, primaryDark } = theme;

export default {
	...baseConfig,
	banner: [
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
