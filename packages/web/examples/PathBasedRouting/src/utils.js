export const isJson = (val) => {
	if (typeof val === 'object') {
		return val;
	}

	try {
		return JSON.parse(val);
	} catch (error) {
		return false;
	}
};
