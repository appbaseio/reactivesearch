import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { ReactiveBase, TreeList, ReactiveList, SelectedFilters } from '@appbaseio/reactivesearch';

import './index.css';

const recLookup = (obj, path) => {
	try {
		const parts = path.split('.');
		if (parts.length === 1) {
			return obj[parts[0]];
		}
		return recLookup(obj[parts[0]], parts.slice(1).join('.'));
	} catch (e) {
		return false;
	}
};
class Main extends Component {
	renderListItems(listItem, parentPath, selectedValues, handleListItemClick) {
		if (!(listItem instanceof Object) || Object.keys(listItem).length === 0) {
			return null;
		}
		const listItemLabel = listItem.key;
		const listItemCount = listItem.count;
		const isLeafNode = !(Array.isArray(listItem.list) && listItem.list.length > 0);

		let newParentPath = listItemLabel;
		if (parentPath) {
			newParentPath = `${parentPath}.${listItemLabel}`;
		}
		const isSelected = recLookup(selectedValues, newParentPath);

		return (
			<li key={newParentPath}>
				{/* eslint-disable jsx-a11y/click-events-have-key-events */}
				{/* eslint-disable jsx-a11y/no-static-element-interactions */}
				<span
					style={isSelected ? { background: 'green', margin: '5px 0' } : {}}
					onClick={() => handleListItemClick(listItemLabel, parentPath, isLeafNode)}
				>
					<React.Fragment>
						<span>{listItemLabel}</span>

						<span>{listItemCount}</span>
					</React.Fragment>
				</span>
				{isLeafNode === false && (
					<div className="--list-child">
						{/* eslint-disable-next-line no-use-before-define */}
						{this.renderLists(
							listItem.list,
							newParentPath,
							isSelected,
							selectedValues,
							handleListItemClick,
						)}
					</div>
				)}
			</li>
		);
	}

	renderLists(transformedData, parentPath, isExpanded, selectedValues, handleClick) {
		return (
			<ul style={isExpanded ? { fontWeight: 600 } : {}}>
				{transformedData.map(listItem =>
					this.renderListItems(listItem, parentPath, selectedValues, handleClick),
				)}
			</ul>
		);
	}
	render() {
		return (
			<ReactiveBase
				app="best-buy-dataset"
				url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
				enableAppbase
			>
				<div className="row">
					<div className="col">
						<TreeList
							loader={<h3>loading...⏰</h3>}
							renderNoResults={() => <b>Oops! Nothing found!</b>}
							componentId="BookSensor"
							showCount
							showCheckbox
							showRadio
							mode="multiple"
							dataField={['class.keyword', 'subClass.keyword']}
							// switcherIcon={bool =>
							// 	(bool ? <span> &#8592;</span> : <span> &#8598;</span>)
							// }
							showIcon
							showLeafIcon
							// icon={
							// 	<span role="img" aria-label="folder-icon">
							// 		🦷
							// 	</span>
							// }
							// leafIcon={
							// 	<span role="img" aria-label="leaf-icon">
							// 		☘️
							// 	</span>
							// }
							showLine
							// renderItem={(label, count, isSelected) => (
							// 	<span style={isSelected ? { background: 'green' } : {}}>
							// 		{label} - {count}
							// 	</span>
							// )}
							// showSearch
							// render={(propData) => {
							// 	const {
							// 		/* eslint-disable no-unused-vars */
							// 		data,
							// 		rawData,
							// 		error,
							// 		handleClick,
							// 		value,
							// 		loading,
							// 	} = propData;
							// 	return this.renderLists(data, '', true, value, handleClick);
							// }}
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
							renderItem={this.reactiveList}
							react={{
								and: ['BookSensor'],
							}}
							includeFields={['class', 'subclass', 'name', 'image', 'salePrice']}
						/>
					</div>
				</div>
			</ReactiveBase>
		);
	}

	reactiveList(data) {
		return (
			<div className="flex book-content" key={data._id}>
				<img src={data.image} alt="Book Cover" className="book-image" />
				<div className="flex column justify-center" style={{ marginLeft: 20 }}>
					<div className="book-header">{data.name}</div>
					<div className="flex column justify-space-between">
						<div>
							<div>
								<span className="authors-list">
									{data.class} > {data.subclass}
								</span>
							</div>
							<div className="ratings-list flex align-center">
								Sale Price 💰 <b>{data.salePrice}</b>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

ReactDOM.render(<Main />, document.getElementById('root'));
