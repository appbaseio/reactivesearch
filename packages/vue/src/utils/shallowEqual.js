// Credit to React-Redux for this util function
// https://github.com/reactjs/react-redux/blob/573db0bfc8d1d50fdb6e2a98bd8a7d4675fecf11/src/utils/shallowEqual.js

const hasOwn = Object.prototype.hasOwnProperty;

function is(x, y) {
	if (x === y) {
		return x !== 0 || y !== 0 || 1 / x === 1 / y;
	}
	// eslint-disable-next-line
	return x !== x && y !== y;
}

export default function shallowEqual(objA, objB) {
	if (is(objA, objB)) return true;
	if (
		typeof objA !== 'object'
		|| objA === null
		|| typeof objB !== 'object'
		|| objB === null
	) {
		return false;
	}

	const keysA = Object.keys(objA);
	const keysB = Object.keys(objB);

	if (keysA.length !== keysB.length) return false;

	for (let i = 0; i < keysA.length; i += 1) {
		if (!hasOwn.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
			return false;
		}
	}

	return true;
}
