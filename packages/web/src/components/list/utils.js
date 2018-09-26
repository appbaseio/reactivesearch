import { getAggsOrder } from '@appbaseio/reactivecore/lib/utils/helper';

const getAggsQuery = (query, props) => {
	const clonedQuery = { ...query };
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

	return clonedQuery;
};

const getCompositeAggsQuery = (query, props, after) => {
	const clonedQuery = { ...query };
	// missing label not available in composite aggs
	const {
		dataField, size, sortBy, showMissing,
	} = props;
	const order = sortBy === 'count' ? {} : { order: sortBy };	// composite aggs only allows asc and desc
	clonedQuery.aggs = {
		[dataField]: {
			composite: {
				sources: [{
					[dataField]: {
						terms: {
							field: dataField,
							...order,
							...(showMissing ? { missing_bucket: true } : {}),
						},
					},
				}],
				size,
				...after,
			},
		},
	};

	return clonedQuery;
};

export { getAggsQuery, getCompositeAggsQuery };
