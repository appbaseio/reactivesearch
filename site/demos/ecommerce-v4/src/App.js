import { ReactiveBase, ReactiveList, SearchBox, SelectedFilters } from '@appbaseio/reactivesearch';
import { BackTop, Col, Grid, Layout, Row, Typography } from 'antd';
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
			initialQueriesSyncTime={1000}
		>
			<Layout>
				<Header className="header">
					<div className="logo">
						<img className="logo__img" src={reactivesearchLogo} alt="logo" />
					</div>
					<Typography.Text className="header__text">Reactivesearch</Typography.Text>
				</Header>
				<Layout>
					<Content className="p10">
						<Row>
							<Row className="p10 fullWidth">
								<SelectedFilters />
							</Row>
							<Row className="p10 fullWidth">
								<SearchBox
									dataField={['albumTitle', 'name']}
									componentId="SearchBox"
									className="fullWidth"
									placeholder="Try searching for 'Tech Toys'"
								/>
							</Row>
						</Row>
						<Row className="relative">
							<Col xs={24} md={8} className="p10">
								{breakpointActive.sm && <CollapsibleFacets />}
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
											<div className="resultItem" key={data._id}>
												<img
													src={data.image}
													alt="Book Cover"
													className="resultItem__img"
												/>
												<div className="resultItem__body">
													<div className="book-header">{data.name}</div>
													<div className="flex column justify-space-between">
														<div>
															<div>
																<span className="resultItem__category">
																	{data.class}
																</span>{' '}
																<span>></span>{' '}
																<span className="resultItem__subCategory">
																	{data.subclass}
																</span>
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
						<BackTop className="backToTop">
							<div className="p10 text-center">&#11014;</div>
						</BackTop>
					</Content>
				</Layout>
			</Layout>
		</ReactiveBase>
	);
}

export default App;
