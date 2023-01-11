# Ecommerce App with RSv4 features

We would be building an ecommerce app using two new features from `@appbaseio/reactivesearch` library. One is a new component called TreeList which allows for nested filtering. Other is exporting your results as CSV or JSON.

### Running the app locally

It as easy as installing all the dependencies `yarn` and then starting the server `yarn start`.

### How to configure TreeList facet?

TreeList is a hierarchical facet. TreeList facet actually uses multiple fields to query. So you usually supply an array of fields to dataField prop. eg. `[ 'class.keyword', 'color.keyword']`. When a top-level field (class.keyword) is selected it selects all the sub-fields nested inside it. eg. If an option from top level field like "Electronics" is selected then it would show all the products related to it regardless of it's color. Users can then improve your filtering by selecting the sub-fields individually. Below we show the filter and its code. Note, we are using `['class.keyword', 'subclass.keyword']`.

```jsx
import { ReactiveChart, TreeList } from '@appbaseio/reactivesearch';
import { Collapse } from 'antd';

const { Panel: CollapsePanel } = Collapse;

export default function CollapsibleFacets() {
	return (
		<Collapse defaultActiveKey={['Class']}>
			<CollapsePanel header={<h3>Class</h3>} key="Class">
				<TreeList
					componentId="Class"
					showCount
					title="TreeList UI"
					showCheckbox
					mode="multiple"
					URLParams
					dataField={['class.keyword', 'subclass.keyword']}
				/>
			</CollapsePanel>
			{/*other facet components*/}
		</Collapse>
	);
}
```

### How to export data from the results?

If we pass a prop called [`showExport`](https://docs.reactivesearch.io/docs/reactivesearch/v3/result/reactivelist/#showexport) to ReactiveList component we would be able to get the data shown in the list as `.csv` or `.json` format.
