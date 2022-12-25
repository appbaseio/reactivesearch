import {
	ReactiveBase,
	ReactiveChart,
	ReactiveList,
	SelectedFilters,
} from '@appbaseio/reactivesearch';
import { Card, Col, Row } from 'antd';
import React from 'react';
import { withRouter } from 'react-router-dom';

function Explore({ history }) {
	return (
		<ReactiveBase
			app="best-buy-dataset"
			url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
			enableAppbase
		>
			<Row>
				<Col md={24} className="p10">
					<SelectedFilters />
				</Col>
			</Row>
			<Row>
				<Col xs={24} md={12} className="p10">
					<Card>
						<ReactiveChart
							componentId="Category"
							dataField="class.keyword"
							chartType="pie"
							type="term"
							title="Category"
							URLParams
							react={{ and: ['SubCategory', 'ReviewAverage', 'Color'] }}
							useAsFilter
						/>
					</Card>
				</Col>
				<Col xs={24} md={12} className="p10">
					<Card>
						<ReactiveChart
							componentId="SubCategory"
							dataField="subclass.keyword"
							chartType="bar"
							type="term"
							title="Sub-Category"
							react={{ and: ['Category', 'ReviewAverage', 'Color'] }}
							URLParams
							useAsFilter
							setOption={(data) => {
								let options = ReactiveChart.getOption(data);
								let xAxis = options && options.xAxis;
								let yAxis = options && options.yAxis;
								xAxis.axisLabel = {
									rotate: 90,
									fontSize: 7,
								};
								yAxis.axisLabel = {
									fontSize: 10,
								};
								options.xAxis = xAxis;
								return options;
							}}
						/>
					</Card>
				</Col>
			</Row>
			<Row>
				<Col xs={24} md={12} className="p10">
					<Card>
						<ReactiveChart
							componentId="ReviewAverage"
							dataField="customerReviewAverage"
							chartType="histogram"
							title="Ratings"
							react={{ and: ['Category', 'SubCategory', 'Color'] }}
							type="range"
							URLParams
							useAsFilter
						/>
					</Card>
				</Col>
				<Col xs={24} md={12} className="p10">
					<Card>
						<ReactiveChart
							componentId="Color"
							dataField="color.keyword"
							chartType="line"
							type="term"
							title="Color"
							react={{ and: ['Category', 'ReviewAverage', 'SubCategory'] }}
							URLParams
							useAsFilter
						/>
					</Card>
				</Col>
			</Row>
			<Row>
				<ReactiveList
					componentId="ListComponent"
					dataField="albumTitle"
					pagination={false}
					infiniteScroll={false}
					showResultStats={false}
					renderNoResults={() => null}
					react={{ and: ['Category', 'SubCategory', 'ReviewAverage', 'Color'] }}
					className="fullWidth"
					render={({ data, ...props }) => {
						return (
							<Card
								className="fullWidth"
								onClick={() => {
									const urlLocation = new URL(window.location.href);
									const urlSearchParams = new URLSearchParams(urlLocation.search);
									history.push(`/search?${urlSearchParams}`);
								}}
							>
								<h1 className="resultsCard">
									{!props.loading
										? `${props.resultStats.numberOfResults} matched the above criteria. View now.`
										: 'View Search Results'}
								</h1>
							</Card>
						);
					}}
				/>
			</Row>
		</ReactiveBase>
	);
}

export default withRouter(Explore);
