const typography = {
	fontFamily:
		'-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Noto Sans", "Ubuntu", "Droid Sans", "Helvetica Neue", sans-serif',
	fontSize: '16px',
};

const light = {
	typography,

	colors: {
		textColor: '#424242',
		primaryTextColor: '#fff',
		primaryColor: '#0B6AFF',
		titleColor: '#424242',
		alertColor: '#d9534f',
		borderColor: '#595959',
	},
};

const dark = {
	typography,

	colors: {
		textColor: '#ffffffcf',
		backgroundColor: '#212121',
		primaryTextColor: '#ffffffcf',
		primaryColor: '#2196F3',
		titleColor: '#ffffffcf',
		alertColor: '#d9534f',
		borderColor: '#666',
	},
};

export default function getTheme(preset) {
	if (preset === 'light') {
		return light;
	}
	return dark;
}
