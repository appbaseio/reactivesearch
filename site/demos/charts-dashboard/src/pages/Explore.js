import { ReactiveBase, ReactiveChart, SingleList } from '@appbaseio/reactivesearch';
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
				<Col xs={24} md={12} style={{ padding: 10 }}>
					<Card>
						<ReactiveChart
							componentId="Category"
							dataField="class.keyword"
							chartType="pie"
							type="term"
							title="Categories"
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
							title="Sub-Categories"
							URLParams
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
						/>
					</Card>
				</Col>
			</Row>
		</ReactiveBase>
	);
}
