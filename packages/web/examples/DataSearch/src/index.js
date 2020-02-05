import React from 'react';
import ReactDOM from 'react-dom';

import {
	ReactiveBase,
	DataSearch,
	MultiList,
	SelectedFilters,
	ReactiveList,
} from '@appbaseio/reactivesearch';
import { Row, Col, Card, Tree } from 'antd';

import ExpandCollapse from 'react-expand-collapse';

import './index.css';

const { TreeNode } = Tree;

const renderAsTree = (res, key = '0') => {
	if (!res) return null;
	const iterable = Array.isArray(res) ? res : Object.keys(res);
	return iterable.map((item, index) => {
		const type = typeof res[item];
		if (type === 'string' || type === 'number') {
			return (
				<TreeNode
					title={
						<div>
							<span>{item}:</span>&nbsp;
							<span dangerouslySetInnerHTML={{ __html: res[item] }} />
						</div>
					}
					key={`${key}-${index + 1}`}
				/>
			);
		}
		const hasObject = res[item] === undefined && typeof item !== 'string';
		const node = hasObject ? item : res[item];
		return (
			<TreeNode
				title={
					typeof item !== 'string'
						? 'Object'
						: `${node || Array.isArray(res) ? item : `${item}: null`}`
				}
				key={`${key}-${index + 1}`}
			>
				{renderAsTree(node, `${key}-${index + 1}`)}
			</TreeNode>
		);
	});
};

function renderItem(res, triggerClickAnalytics) {
	return (
		// eslint-disable-next-line
		<div onClick={triggerClickAnalytics} className="list-item" key={res._id}>
			<ExpandCollapse previewHeight="390px" expandText="Show more">
				<Tree showLine>{renderAsTree(res)}</Tree>
			</ExpandCollapse>
		</div>
	);
}

const App = () => (
	<ReactiveBase
		app="works"
		credentials="J2pmkUyGm:c97df180-cc40-43a7-a71e-1d9bb3331c80"
		url="https://elasticsearch-eaas-rosspetevmusicsalescouk-classical.searchbase.io"
		analytics
		searchStateHeader
	>
		<Row gutter={16} style={{ padding: 20 }}>
			<Col span={12}>
				<Card>
					<MultiList
						componentId="composers"
						dataField="composers.name.keyword"
						showSearch="false"
						nestedField="composers"
						size={100}
						style={{
							marginBottom: 20,
						}}
						react={{
							and: [
								'search',
								'composers',
								'categories',
								'subCategories',
								'yearComposed',
							],
						}}
						title="Composer"
						URLParams
					/>
				</Card>
			</Col>
			<Col span={12}>
				<DataSearch
					componentId="search"
					dataField={['title']}
					fieldWeights={[]}
					fuzziness={0}
					highlightField={['title']}
					style={{
						marginBottom: 20,
					}}
					react={{
						and: ['composers', 'categories', 'subCategories', 'yearComposed'],
					}}
					URLParams
				/>

				<SelectedFilters />
				<div id="result">
					<ReactiveList
						componentId="result"
						dataField="_score"
						pagination
						react={{
							and: [
								'search',
								'composers',
								'categories',
								'subCategories',
								'yearComposed',
							],
						}}
						renderItem={renderItem}
						size={5}
						style={{
							marginTop: 20,
						}}
						paginationAt="both"
						URLParams
					/>
				</div>
			</Col>
		</Row>
	</ReactiveBase>
);

ReactDOM.render(<App />, document.getElementById('root'));
