import ReactDOM from 'react-dom/client';
import { List, Checkbox, Card, Row, Col } from 'antd';
import { ReactiveBase, MultiList, ReactiveList, SelectedFilters } from '@appbaseio/reactivesearch';
import 'antd/dist/antd.css';
import './index.css';

const { Meta } = Card;

const Main = () => (
	<ReactiveBase
		app="good-books-ds"
		url="https://reactivesearch-api-9-4-0.onrender.com"
		credentials="d03e6f5f33d5:49124674-554e-4343-9ab2-006b2932f5c0"
	>
		<div className="row">
			<div
				className="col"
				style={{
					maxWidth: 300,
					minWidth: 250,
				}}
			>
				<MultiList
					componentId="BookSensor"
					dataField="authors.keyword"
					title="Filter by Authors"
					aggregationSize={10}
					showSearch={false}
					render={({ loading, error, data, value, handleChange }) => {
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
								renderItem={(item) => (
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

			<div
				className="col"
				style={{
					maxWidth: '60%',
				}}
			>
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
								{data.map((item) => (
									<Col key={item._id} span={12}>
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
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />);
