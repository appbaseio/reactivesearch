import { ReactiveBase, ReactiveList, SearchBox, SelectedFilters } from '@appbaseio/reactivesearch';
import { Col, Grid, Layout, Row, Typography } from 'antd';
import CollapsibleFacets from './components/CollapsibleFacets';
import MobileFacets from './components/MobileFacets';
import reactivesearchLogo from './reactivesearch-icon.png';

import './App.css';

const { Header, Content } = Layout;
const { useBreakpoint } = Grid;

function App({ history }) {
	const breakpointActive = useBreakpoint();
	return (
		<ReactiveBase
			app="best-buy-dataset"
			url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
			enableAppbase
		>
			<Layout>
				<Header
					style={{
						padding: 0,
						display: 'flex',
						height: 'max-content',
					}}
				>
					<div style={{ paddingLeft: 10, boxSizing: 'border-box' }}>
						<img style={{ width: 30 }} src={reactivesearchLogo} alt="logo" />
					</div>
					<Typography.Text
						style={{ color: '#fff', marginLeft: 10, justifySelf: 'flex-start' }}
					>
						Reactivesearch
					</Typography.Text>
				</Header>
				<Layout>
					<Content style={{ padding: 15 }}>
						<Row>
							<Row style={{ padding: 10, width: '100%' }}>
								<SelectedFilters />
							</Row>
							<Row style={{ padding: 10, width: '100%' }}>
								<SearchBox
									dataField={['albumTitle', 'name']}
									componentId="SearchBox"
									style={{ width: '100%' }}
									placeholder="Try searching for 'Tech Toys'"
								/>
							</Row>
						</Row>
						<Row style={{ position: 'relative' }}>
							<Col xs={24} md={8} style={{ padding: 10 }}>
								{breakpointActive.md && <CollapsibleFacets />}
								{breakpointActive.xs && <MobileFacets />}
							</Col>
							<Col md={16} xs={24}>
								<ReactiveList
									componentId="SearchResult"
									dataField="original_title"
									className="result-list-container"
									from={0}
									size={5}
									showExport
									innerClass={{ resultStats: 'result-stats' }}
									renderItem={(data) => {
										return (
											<div
												style={{
													display: 'flex',
													padding: 20,
													background: '#fff',
												}}
												key={data._id}
											>
												<img
													src={data.image}
													alt="Book Cover"
													style={{ width: 100 }}
												/>
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
																<span className="">
																	{data.salePrice}
																</span>
															</div>
														</div>
													</div>
												</div>
											</div>
										);
									}}
									react={{
										and: [
											'Category',
											'SubCategory',
											'Color',
											'ReviewAverage',
											'SearchBox',
										],
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
					</Content>
				</Layout>
			</Layout>
		</ReactiveBase>
	);
}

export default App;
