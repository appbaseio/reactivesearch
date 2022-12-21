import { DynamicRangeSlider, ReactiveBase, ReactiveChart, ReactiveList, SearchBox, SelectedFilters, SingleDropdownList, SingleList } from '@appbaseio/reactivesearch';
import { Card, Col, Row } from 'antd';
import React from 'react';

export default function Search() {
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
				<Col md={24} style={{ padding: 10 }}>
					<SearchBox dataField="albumTitle" componentId="SearchBox" />
				</Col>
			</Row>
			<Row>
				<Col xs={24} md={8} style={{ padding: 10 }}>
					<Card>
						<h3>Category</h3>
						<SingleList componentId="Category" dataField="class.keyword" URLParams />
					</Card>
					<Card>
						<h3>Sub-Category</h3>
						<ReactiveChart
							componentId="SubCategory"
							dataField="subclass.keyword"
							chartType="bar"
							type="term"
							URLParams
							useAsFilter
						/>
					</Card>
					<Card>
						<h3>Ratings</h3>
						<DynamicRangeSlider
							componentId="ReviewAverage"
							dataField="customerReviewAverage"
							range={{ start: 0, end: 5 }}
							rangeLabels={(min, max) => ({
								start: min + ' ⭐️',
								end: max + ' ⭐️',
							})}
							showHistogram
							URLParams
						/>
					</Card>
					<Card>
						<h3>Color</h3>
						<ReactiveChart
							componentId="Color"
							dataField="color.keyword"
							chartType="line"
							type="term"
							URLParams
							useAsFilter
						/>
					</Card>
				</Col>
				<Col xs={24} md={16} style={{ padding: 10 }}>
					<ReactiveList
						componentId="SearchResult"
						dataField="original_title"
						className="result-list-container"
						from={0}
						size={5}
						renderItem={(data) => {
							return (
								<div
									style={{ display: 'flex', padding: 20, background: '#fff' }}
									key={data._id}
								>
									<img src={data.image} alt="Book Cover" style={{ width: 100 }} />
									<div
										style={{
											display: 'flex',
											flexDirection: 'column',
											marginLeft: 20,
										}}
									>
										<div className="book-header">{data.name}</div>
										<div className="flex column justify-space-between">
											<div>
												<div>
													{data.class} > {data.subclass}
												</div>
												<div className="ratings-list flex align-center">
													Sale price:{' '}
													<span className="">{data.salePrice}</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							);
						}}
						react={{
							and: ['Category', 'SubCategory', 'Color', 'ReviewAverage', 'SearchBox'],
						}}
						includeFields={[
							'class',
							'subclass',
							'name',
							'image',
							'salePrice',
							'categoryPath',
						]}
					/>
				</Col>
			</Row>
		</ReactiveBase>
	);
}
