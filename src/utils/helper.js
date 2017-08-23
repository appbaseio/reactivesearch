export function isEqual(x, y) {
	if ( x === y ) return true;
	if ( ! ( x instanceof Object ) || ! ( y instanceof Object ) ) return false;
	if ( x.constructor !== y.constructor ) return false;

	for ( var p in x ) {
		if ( ! x.hasOwnProperty( p ) ) continue;
		if ( ! y.hasOwnProperty( p ) ) return false;
		if ( x[ p ] === y[ p ] ) continue;
		if ( typeof( x[ p ] ) !== "object" ) return false;
		if ( ! isEqual( x[ p ],  y[ p ] ) ) return false;
	}

	for ( p in y ) {
		if ( y.hasOwnProperty( p ) && ! x.hasOwnProperty( p ) ) return false;
	}
	return true;
}

export function debounce(callback, wait, context = this) {
	let timeout = null;
	let callbackArgs = null;

	const later = () => callback.apply(context, callbackArgs);

	return function() {
		callbackArgs = arguments;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	}
}

export function getQueryOptions(props) {
	const options = {};
	if (props.size !== undefined) {
		options.size = props.size;
	}
	if (props.from !== undefined) {
		options.from = props.from;
	}
	return options;
}

export function buildQuery(component, dependencyTree, queryList) {
	let query = null;

	if (component in dependencyTree) {
		query = getQuery(dependencyTree[component], queryList);
	}
	return query;
}

function getQuery(react, queryList) {
	let query = {};
	for (conjunction in react) {
		if (Array.isArray(react[conjunction])) {
			const operation = getOperation(conjunction);
			const queryArr = react[conjunction].map(comp => {
				if (comp in queryList) {
					return queryList[comp];
				}
				return null;
			}).filter(item => item !== null);

			query = createBoolQuery(operation, queryArr);
		} else if (typeof react[conjunction] === "string") {
			const operation = getOperation(conjunction);
			query = createBoolQuery(operation, queryList[react[conjunction]]);
		} else if (typeof react[conjunction] === "object" &&
			react[conjunction] !== null &&
			!Array.isArray(react[conjunction])) {
			query = getQuery(react[conjunction], queryList);
		}
	}
	return query;
}

function getOperation(conjunction) {
	if (conjunction === "and") {
		return "must";
	}
	if (conjunction === "or") {
		return "should";
	}
	return "must_not";
}

function createBoolQuery(operation, query) {
	return {
		bool: {
			[operation]: query
		}
	};
}

export function btoa(input = "") {
	const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	let str = input;
	let output = "";

	for (let block = 0, charCode, i = 0, map = chars;
		str.charAt(i | 0) || (map = "=", i % 1);
		output += map.charAt(63 & block >> 8 - i % 1 * 8)) {

		charCode = str.charCodeAt(i += 3/4);

		if (charCode > 0xFF) {
			throw new Error(`"btoa" failed: The string to be encoded contains characters outside of the Latin1 range.`);
		}

		block = block << 8 | charCode;
	}

	return output;
}

export function pushToAndClause(react, component) {
	if (react.and) {
		if (Array.isArray(react.and)) {
			react.and.push(component);
			return react;
		} else if (typeof react.and === "string") {
			react.and = [react.and, component]
			return react;
		} else {
			react.and = this.pushToAndClause(react.and, component);
			return react;
		}
	} else {
		return {...react, and: component}
	}
}
