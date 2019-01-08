import { getAggsOrder } from '@appbaseio/reactivecore/lib/utils/helper';

const getAggsQuery = (query, props) => {
	const clonedQuery = { ...query };
	clonedQuery.size = 0;
	const { nestedField } = props;
	if (nestedField) {
		clonedQuery.aggs = {
			[nestedField]: {
				nested: {
					path: nestedField,
				},
				aggs: {
					[props.dataField]: {
						terms: {
							field: props.dataField,
							size: props.size,
							order: getAggsOrder(props.sortBy || 'asc'),
						},
					},
				},
			},
		};
	} else {
		clonedQuery.aggs = {
			[props.dataField]: {
				terms: {
					field: props.dataField,
					size: props.size,
					order: getAggsOrder(props.sortBy || 'asc'),
				},
			},
		};
	}

	return clonedQuery;
};

export default getAggsQuery;
