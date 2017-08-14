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
			const queryArr = react[conjunction].map(comp => queryList(comp));
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
