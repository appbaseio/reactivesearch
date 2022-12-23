import { ReactiveBase, ReactiveList, SearchBox, SelectedFilters } from '@appbaseio/reactivesearch';
import { Col, Grid, Row, BackTop } from 'antd';
import React from 'react';
import CollapsibleFacets from '../components/CollapsibleFacets';
import MobileFacets from '../components/MobileFacets';

const { useBreakpoint } = Grid;

export default function Search() {
	const breakpointActive = useBreakpoint();

	return (
		<ReactiveBase
			app="best-buy-dataset"
			url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
			enableAppbase
			initialQueriesSyncTime={1000}
		>
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
			<Row>
				<Col xs={24} md={8} style={{ padding: 10 }}>
					{breakpointActive.sm && <CollapsibleFacets />}
					{breakpointActive.xs && <MobileFacets />}
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
			<BackTop
				style={{
					boxShadow: 'black 0px 0px 5px',
					borderRadius: '3px',
					width: 'max-content',
					background: '#fff',
				}}
			>
				<div style={{ padding: 10 }}>&#11014;</div>
			</BackTop>
		</ReactiveBase>
	);
}
