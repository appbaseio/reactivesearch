import { helper } from '@appbaseio/reactivecore';

const { getAggsOrder } = helper;
const getAggsQuery = (query, props) => {
	const clonedQuery = { ...query, ...(props.defaultQuery && props.defaultQuery()) };
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
				size: clonedQuery.size,
			},
		};
	}

	return clonedQuery;
};

const getCompositeAggsQuery = (query, props, after) => {
	const clonedQuery = { ...query, ...(props.defaultQuery && props.defaultQuery()) };
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
				size: clonedQuery.size,
			},
		};
	}

	return clonedQuery;
};

export { getAggsQuery, getCompositeAggsQuery };
