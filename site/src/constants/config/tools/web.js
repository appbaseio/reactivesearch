import theme from './../../theme/web';
import baseConfig from './../base/web';

const { primaryDark } = theme;

export default {
	...baseConfig,
	banner1: {
		backgroundColor: primaryDark,
	},
	banner2: {
		backgroundColor: '#7100E2',
	},
	banner3: {
		backgroundColor: '#133146',
	},
	banner4: {
		backgroundColor: '#3D84FF',
	},
	banner5: {
		backgroundColor: '#DDEBFF',
	},
	bannerVue: {
		backgroundColor: '#1B2C36',
	},
};
