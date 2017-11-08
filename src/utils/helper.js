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

export function buildQuery(component, dependencyTree, queryList, queryOptions) {
	let queryObj = null,
		options = null;

	if (component in dependencyTree) {
		queryObj = getQuery(dependencyTree[component], queryList);
		options = getExternalQueryOptions(dependencyTree[component], queryOptions, component);
	}
	return { queryObj, options };
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
	if ((Array.isArray(query) && query.length) || (!Array.isArray(query) && query)) {
		return {
			bool: {
				[operation]: query
			}
		};
	}
	return null;
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
		return { ...react, and: component }
	}
}

// checks and executes before/onValueChange for sensors
export function checkValueChange(componentId, value, beforeValueChange, onValueChange, performUpdate) {
	const executeUpdate = () => {
		performUpdate();
		if (onValueChange) {
			onValueChange(value);
		}
	}
	if (beforeValueChange) {
		beforeValueChange(value)
			.then(executeUpdate)
			.catch((e) => {
				console.warn(`${componentId} - beforeValueChange rejected the promise with `, e);
			});
	} else {
		executeUpdate();
	}
}

export function getAggsOrder(sortBy) {
	if (sortBy === "count") {
		return {
			_count: "desc"
		};
	}
	return {
		_term: sortBy
	};
}

function getExternalQueryOptions(react, options, component) {
	let queryOptions = {};

	for (conjunction in react) {
		if (Array.isArray(react[conjunction])) {
			react[conjunction].forEach(comp => {
				if (options[comp]) {
					queryOptions = { ...queryOptions, ...options[comp] };
				}
			});
		} else if (typeof react[conjunction] === "string") {
			if (options[react[conjunction]]) {
				queryOptions = { ...queryOptions, ...options[react[conjunction]] };
			}
		} else if (typeof react[conjunction] === "object" &&
			react[conjunction] !== null &&
			!Array.isArray(react[conjunction])) {
			queryOptions = { ...queryOptions , ...getExternalQueryOptions(react[conjunction], options) };
		}
	}
	if (options[component]) {
		queryOptions = { ...queryOptions, ...options[component] };
	}
	return queryOptions;
}
