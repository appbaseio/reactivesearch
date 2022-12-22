import { DynamicRangeSlider, ReactiveChart, SingleList, TreeList } from '@appbaseio/reactivesearch';
import { Collapse } from 'antd';

const { Panel: CollapsePanel } = Collapse;

export default function CollapsibleFacets() {
	return (
		<Collapse defaultActiveKey={['Category', 'Sub-Category', 'Ratings', 'Color']}>
			<CollapsePanel header={<h3>Category</h3>} key="Category">
				<TreeList
					componentId="Category"
					showCount
					title="TreeList UI"
					showCheckbox
					mode="multiple"
					URLParams
					dataField={['class.keyword', 'subclass.keyword']}
				/>
			</CollapsePanel>
			<CollapsePanel header={<h3>Color</h3>} key="Color">
				<ReactiveChart
					componentId="Color"
					dataField="color.keyword"
					chartType="pie"
					type="term"
					URLParams
					useAsFilter
					loader="Loading..."
				/>
			</CollapsePanel>
			<CollapsePanel header={<h3>Alternate categories</h3>} key="Sub-Category">
				<ReactiveChart
					componentId="SubCategory"
					dataField="categoryPath.name.keyword"
					chartType="bar"
					type="term"
					URLParams
					useAsFilter
					loader="Loading..."
				/>
			</CollapsePanel>
		</Collapse>
	);
}
