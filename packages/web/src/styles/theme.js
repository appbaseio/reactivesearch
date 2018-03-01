const typography = {
	fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Noto Sans", "Ubuntu", "Droid Sans", "Helvetica Neue", sans-serif',
	fontSize: '16px',
};

const light = {
	typography,

	colors: {
		textColor: '#424242',
		primaryColor: '#0B6AFF',
		primaryTextColor: '#fff',
		titleColor: '#424242',
		alertColor: '#d9534f',
	},
};

const dark = {
	typography,

	colors: {
		textColor: '#424242',
		primaryColor: '#0B6AFF',
		primaryTextColor: '#fff',
		titleColor: '#424242',
		alertColor: '#d9534f',
	},
};

export default function getTheme(preset) {
	if (preset === 'light') {
		return light;
	}
	return dark;
}
