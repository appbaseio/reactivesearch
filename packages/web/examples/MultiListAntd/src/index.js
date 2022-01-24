import React from 'react';
import ReactDOM from 'react-dom';
import { List, Checkbox, Card, Row, Col } from 'antd';
import { ReactiveBase, MultiList, ReactiveList, SelectedFilters } from '@appbaseio/reactivesearch';
import 'antd/dist/antd.css';
import './index.css';

const { Meta } = Card;

const Main = () => (
	<ReactiveBase
		app="good-books-ds"
		url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
		enableAppbase
	>
		<div className="row">
			<div className="col">
				<MultiList
					componentId="BookSensor"
					dataField="authors.keyword"
					title="Filter by Authors"
					aggregationSize={10}
					showSearch={false}
					render={({
						loading, error, data, value, handleChange,
					}) => {
						if (loading) {
							return <div>Fetching Results.</div>;
						}
						if (error) {
							return (
								<div>
									Something went wrong! Error details {JSON.stringify(error)}
								</div>
							);
						}
						return (
							<List
								itemLayout="horizontal"
								dataSource={data}
								renderItem={item => (
									<List.Item>
										<Checkbox
											style={{
												marginRight: 20,
											}}
											value={item.key}
											checked={value ? value[item.key] : false}
											onChange={handleChange}
										/>
										<List.Item.Meta title={item.key} />
										<div>{item.doc_count}</div>
									</List.Item>
								)}
							/>
						);
					}}
				/>
			</div>

			<div className="col">
				<SelectedFilters />
				<ReactiveList
					componentId="SearchResult"
					dataField="original_title"
					className="result-list-container"
					from={0}
					size={5}
					react={{
						and: ['BookSensor'],
					}}
					render={({ data }) => (
						<div className="site-card-wrapper">
							<Row gutter={16}>
								{data.map(item => (
									<Col key={item._id} span={8}>
										<Card
											hoverable
											cover={
												<img alt={item.original_title} src={item.image} />
											}
										>
											<Meta
												title={item.original_title}
												description={item.description}
											/>
											<div>
												by{' '}
												<span className="authors-list">{item.authors}</span>
											</div>
											<div className="ratings-list flex align-center">
												<span className="stars">
													{Array(item.average_rating_rounded)
														.fill('x')
														.map((_, index) => (
															<i
																className="fas fa-star"
																key={index} //eslint-disable-line
															/>
														))}
												</span>
												<span className="avg-rating">
													({item.average_rating} avg)
												</span>
											</div>
										</Card>
									</Col>
								))}
							</Row>
						</div>
					)}
				/>
			</div>
		</div>
	</ReactiveBase>
);

ReactDOM.render(<Main />, document.getElementById('root'));
