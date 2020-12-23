import { helper } from '@appbaseio/reactivecore';

const { getAggsOrder } = helper;

const extractQuery = props => {
	const queryToBeReturned = {};
	if (props.defaultQuery) {
		const evaluateQuery = props.defaultQuery([], props);
		if (evaluateQuery) {
			if (evaluateQuery.query) {
				queryToBeReturned.query = evaluateQuery.query;
			}
			if (evaluateQuery.aggs) {
				queryToBeReturned.aggs = evaluateQuery.aggs;
			}
		}
	}
	return queryToBeReturned;
};
// eslint-disable-next-line import/prefer-default-export
export const getAggsQuery = (query, props) => {
	const clonedQuery = query;
	const { dataField, size, sortBy, showMissing, missingLabel } = props;
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
	return { ...clonedQuery, ...extractQuery(props) };
};
