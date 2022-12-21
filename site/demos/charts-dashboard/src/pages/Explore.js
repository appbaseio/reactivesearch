import { ReactiveBase, ReactiveChart, ReactiveList, SelectedFilters } from '@appbaseio/reactivesearch';
import { Card, Col, Row } from 'antd';
import React from 'react';

export default function Explore() {
	return (
		<ReactiveBase
			app="best-buy-dataset"
			url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
			enableAppbase
		>
			<Row>
				<Col md={24} style={{ padding: 10 }}>
					<SelectedFilters />
				</Col>
			</Row>
			<Row>
				<Col xs={24} md={12} style={{ padding: 10 }}>
					<Card>
						<ReactiveChart
							componentId="Category"
							dataField="class.keyword"
							chartType="pie"
							type="term"
							title="Category"
							URLParams
						/>
					</Card>
				</Col>
				<Col xs={24} md={12} style={{ padding: 10 }}>
					<Card>
						<ReactiveChart
							componentId="SubCategory"
							dataField="subclass.keyword"
							chartType="bar"
							type="term"
							title="Sub-Category"
							URLParams
							useAsFilter
						/>
					</Card>
				</Col>
			</Row>
			<Row>
				<Col xs={24} md={12} style={{ padding: 10 }}>
					<Card>
						<ReactiveChart
							componentId="ReviewAverage"
							dataField="customerReviewAverage"
							chartType="histogram"
							type="range"
						/>
					</Card>
				</Col>
				<Col xs={24} md={12} style={{ padding: 10 }}>
					<Card>
						<ReactiveChart
							componentId="Color"
							dataField="color.keyword"
							chartType="line"
							type="term"
							title="Color"
							URLParams
							useAsFilter
						/>
					</Card>
				</Col>
			</Row>
			<Row>
				<Col md={24}>
					<ReactiveList
						componentId="ListComponent"
						dataField="albumTitle"
						pagination={false}
						infiniteScroll={false}
						showResultStats={false}
						renderNoResults={() => null}
						render={({ data, ...props }) => {
							return (
								<Card style={{ width: '100%' }}>
									<h1
										style={{
											padding: 10,
											textAlign: 'center',
											cursor: 'pointer',
											color: '#00a',
										}}
									>
										{!props.loading
											? `${props.resultStats.numberOfResults} matched the above criteria. View now.`
											: 'View Search Results'}
									</h1>
								</Card>
							);
						}}
					/>
				</Col>
			</Row>
		</ReactiveBase>
	);
}
