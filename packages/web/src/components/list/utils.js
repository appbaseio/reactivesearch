import { helper } from '@appbaseio/reactivecore';

const { getAggsOrder, getOptionsFromQuery } = helper;

/**
 * Updates the query for the internal component
 */
export const updateInternalQuery = (
	componentId,
	queryOptions,
	value,
	props,
	defaultQueryToExecute,
	queryParams,
) => {
	const { defaultQuery } = props;
	let defaultQueryOptions;
	let query;
	if (defaultQuery) {
		const queryTobeSet = defaultQuery(value, props);
		({ query } = queryTobeSet || {});
		defaultQueryOptions = getOptionsFromQuery(queryTobeSet);
	}
	props.setQueryOptions(componentId, {
		...defaultQueryOptions,
		...(queryOptions || defaultQueryToExecute),
	});
	if (query) {
		props.updateQuery({
			componentId,
			query,
			...queryParams,
		});
	}
};
// extracts query options from defaultQuery if set
const extractQueryFromDefaultQuery = (defaultQuery) => {
	let queryToBeReturned = {};
	if (defaultQuery) {
		const evaluateQuery = defaultQuery();
		if (evaluateQuery) {
			// we should only retrieve and set the query options here.
			// [Not implemented yet] `query` key should be handled separately for
			// adding it to `queryList` in the redux store
			const { query, ...options } = evaluateQuery;
			if (options) {
				queryToBeReturned = options;
			}
		}
	}
	return queryToBeReturned;
};

const getAggsQuery = (query, props) => {
	const clonedQuery = query;
	const {
		dataField, size, sortBy, showMissing, missingLabel,
	} = props;
	clonedQuery.size = 0;
	clonedQuery.aggs = {
		[dataField]: {
			terms: {
				field: dataField,
				size,
				order: getAggsOrder(sortBy || 'count'),
				...(showMissing ? { missing: missingLabel } : {}),
			},
		},
	};

	if (props.nestedField) {
		clonedQuery.aggs = {
			reactivesearch_nested: {
				nested: {
					path: props.nestedField,
				},
				aggs: clonedQuery.aggs,
			},
		};
	}
	return { ...clonedQuery, ...extractQueryFromDefaultQuery(props.defaultQuery) };
};

const getCompositeAggsQuery = (query, props, after) => {
	const clonedQuery = query;
	// missing label not available in composite aggs
	const {
		dataField, size, sortBy, showMissing,
	} = props;

	// composite aggs only allows asc and desc
	const order = sortBy === 'count' ? {} : { order: sortBy };

	clonedQuery.aggs = {
		[dataField]: {
			composite: {
				sources: [
					{
						[dataField]: {
							terms: {
								field: dataField,
								...order,
								...(showMissing ? { missing_bucket: true } : {}),
							},
						},
					},
				],
				size,
				...after,
			},
		},
	};
	clonedQuery.size = 0;

	if (props.nestedField) {
		clonedQuery.aggs = {
			reactivesearch_nested: {
				nested: {
					path: props.nestedField,
				},
				aggs: clonedQuery.aggs,
			},
		};
	}
	return { ...clonedQuery, ...extractQueryFromDefaultQuery(props.defaultQuery) };
};

export { getAggsQuery, getCompositeAggsQuery };
