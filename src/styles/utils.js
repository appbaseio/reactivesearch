export const getLinkStyle = (configName) => {
	if (configName === 'vue') {
		return {
			opacity: 0.7,
		};
	}
	return {};
};
export const getButtonStyle = (configName) => {
	if (configName === 'vue') {
		return {
			backgroundColor: '#324754',
		};
	}
	return {};
};