// eslint-disable-next-line
export const hasGoogleMap = () =>
	typeof window.google === 'object' && typeof window.google.maps === 'object';

// You can use a deep access function based on a string for the path.
// Note that you can't have any periods in the property names.

export function traverseNestedObject(refObj, propString) {
	if (!propString) {
		return refObj;
	}
	let obj = refObj;
	let prop;
	const props = propString.split('.');
	let i;
	let iLen;
	for (i = 0, iLen = props.length - 1; i < iLen; i += 1) {
		prop = props[i];

		const candidate = obj[prop];
		if (candidate !== undefined) {
			obj = candidate;
		} else {
			break;
		}
	}
	return obj[props[i]];
}
