/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {
	ReactiveBase,
	TreeList,
	ReactiveList,
	SelectedFilters,
	componentTypes,
} from '@appbaseio/reactivesearch';

import './index.css';

class Main extends Component {
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
							componentId="BookSensor"
							showCount
							title="TreeList UI"
							mode="multiple"
							URLParams
							dataField={[
								'class.keyword',
								'subclass.keyword',
								'categoryPath.name.keyword',
							]}
							showSearch
						/>
					</div>

					<div className="col">
						<SelectedFilters
							render={(props) => {
								const { selectedValues, setValue } = props;
								const clearFilter = (component) => {
									setValue(component, null);
								};

								const filters = Object.keys(selectedValues).map((component) => {
									if (!selectedValues[component].value) return null;

									if (
										selectedValues[component].componentType
										=== componentTypes.treeList
									) {
										const { value } = selectedValues[component];
										const valueArray = value;

										return (
											<div
												style={{
													display: 'flex',
													gap: '10px',
													flexWrap: 'wrap',
												}}
											>
												{valueArray.map((valueItem, index) => {
													const pathParts = valueItem.split(' > ');
													return (
														<div
															style={{
																borderRight: '1px solid #b75873',
																padding: '5px',
															}}
														>
															{pathParts.map(
																(pathItem, pathItemIndex) => (
																	<span
																		onClick={() => {
																			const newValueArray = [
																				...valueArray,
																			];
																			newValueArray[index]
																				= pathParts.length
																				=== 1
																					? ''
																					: pathParts
																						.slice(
																							0,
																							pathItemIndex
																									+ 1,
																						)
																						.join(
																							' > ',
																						);
																			if (
																				JSON.stringify(
																					newValueArray,
																				)
																				=== JSON.stringify(
																					valueArray,
																				)
																			) {
																				return;
																			}
																			setValue(
																				component,
																				newValueArray.filter(
																					item =>
																						!!item,
																				),
																			);
																		}}
																	>
																		<a href="#">{pathItem}</a>{' '}
																		{pathItemIndex
																		!== pathParts.length - 1 ? (
																				<span
																				style={{
																						margin: '0 4px',
																					}}
																			>
																					➤
                   </span>
																			) : (
																				''
																			)}
																	</span>
																),
															)}
														</div>
													);
												})}
											</div>
										);
									}

									return (
										<button
											key={component}
											onClick={() => clearFilter(component)}
										>
											{selectedValues[component].value}
										</button>
									);
								});

								return filters;
							}}
						/>
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
							defaultQuery={() => ({
								track_total_hits: true,
							})}
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
