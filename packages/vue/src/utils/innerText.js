// eslint-disable-next-line import/prefer-default-export
export const innerText = (jsx) => {
	// Empty
	if (
		jsx === null
    || typeof jsx === 'boolean'
    || typeof jsx === 'undefined'
	) {
		return '';
	}

	// Numeric children.
	if (typeof jsx === 'number') {
		return jsx.toString();
	}

	// String literals.
	if (typeof jsx === 'string') {
		return jsx;
	}

	// Array of JSX.
	if (Array.isArray(jsx)) {
		// eslint-disable-next-line no-use-before-define
		return jsx.reduce(reduceJsxToString, '');
	}


	// Children prop.
	if (Object.prototype.hasOwnProperty.call(jsx, 'children')
	) {
		return innerText(jsx.children);
	}

	// Default
	return '';
};

innerText.default = innerText;

function reduceJsxToString(previous, current) {
	return previous + innerText(current);
}
