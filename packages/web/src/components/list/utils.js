import { getAggsOrder } from '@appbaseio/reactivecore/lib/utils/helper';

const getAggsQuery = (query, props) => {
	const clonedQuery = { ...query };
	clonedQuery.size = 0;
	clonedQuery.aggs = {
		[props.dataField]: {
			terms: {
				field: props.dataField,
				size: props.size,
				order: getAggsOrder(props.sortBy || 'count'),
				...(props.showMissing ? { missing: props.missingLabel } : {}),
			},
		},
	};

	return clonedQuery;
};

const getCompositeAggsQuery = () => ({

});

export { getAggsQuery, getCompositeAggsQuery };
