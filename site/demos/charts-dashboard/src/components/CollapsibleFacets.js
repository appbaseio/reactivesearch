import { DynamicRangeSlider, ReactiveChart, SingleList } from '@appbaseio/reactivesearch';
import { Collapse } from 'antd';

const { Panel: CollapsePanel } = Collapse;

export default function CollapsibleFacets({ isMobile }) {
	return (
		<Collapse
			defaultActiveKey={
				isMobile ? ['Category'] : ['Category', 'Sub-Category', 'Ratings', 'Color']
			}
		>
			<CollapsePanel header={<h3>Category</h3>} key="Category">
				<SingleList
					componentId="Category"
					dataField="class.keyword"
					URLParams
					loader="Loading..."
					react={{ and: ['SubCategory', 'ReviewAverage', 'Color', 'SearchBox'] }}
				/>
			</CollapsePanel>
			<CollapsePanel header={<h3>Sub-Category</h3>} key="Sub-Category">
				<ReactiveChart
					componentId="SubCategory"
					dataField="subclass.keyword"
					chartType="bar"
					type="term"
					URLParams
					useAsFilter
					loader="Loading..."
					className="chart--line"
					react={{ and: ['Category', 'ReviewAverage', 'Color', 'SearchBox'] }}
					setOption={(data) => {
						let options = ReactiveChart.getOption(data);
						let xAxis = options && options.xAxis;
						let yAxis = options && options.yAxis;
						xAxis.axisLabel = {
							rotate: 90,
							fontSize: 7,
						};
						yAxis.axisLabel = {
							fontSize: 8,
						};
						options.xAxis = xAxis;
						return options;
					}}
				/>
			</CollapsePanel>
			<CollapsePanel header={<h3>Ratings</h3>} key="Ratings">
				<DynamicRangeSlider
					componentId="ReviewAverage"
					dataField="customerReviewAverage"
					range={{ start: 0, end: 5 }}
					rangeLabels={(min, max) => ({
						start: min + ' ⭐️',
						end: max + ' ⭐️',
					})}
					loader="Loading..."
					showHistogram
					URLParams
					react={{ and: ['Category', 'SubCategory', 'Color', 'SearchBox'] }}
				/>
			</CollapsePanel>
			<CollapsePanel header={<h3>Color</h3>} key="Color">
				<ReactiveChart
					componentId="Color"
					dataField="color.keyword"
					chartType="line"
					type="term"
					URLParams
					useAsFilter
					loader="Loading..."
					react={{ and: ['Category', 'SubCategory', 'ReviewAverage', 'SearchBox'] }}
				/>
			</CollapsePanel>
		</Collapse>
	);
}
