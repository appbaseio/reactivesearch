import React from 'react';
import ReactDOM from 'react-dom/client';
import {
	ReactiveBase,
	SearchBox,
	MultiList,
	ReactiveList,
	SelectedFilters,
} from '@appbaseio/reactivesearch';
import './index.css';

const App = () => {
	return (
		<ReactiveBase
			app="yc-companies-dataset"
			url="https://reactivesearch-api-9-4-0.onrender.com"
			credentials="d03e6f5f33d5:49124674-554e-4343-9ab2-006b2932f5c0"
			enableAppbase
		>
			<div className="container">
				<h2>Vector Search with ReactiveSearch</h2>
				<SearchBox
					componentId="search"
					dataField={['name', 'one_liner']}
					placeholder="Vector search on a dataset of startup companies"
					autosuggest={false}
					style={{ marginBottom: '1rem' }}
					URLParams
				/>
				<SelectedFilters />

				<div className="layout">
					<div className="facet-container">
						<MultiList
							componentId="industries"
							dataField="industries.keyword"
							title="Industries"
							placeholder="Filter by industries"
							showSearch
							style={{ marginBottom: '1rem' }}
                            aggregationSize={96}
                            innerClass={{"list": "facet-list"}}
						/>
					</div>

					<div className="results-container">
						<ReactiveList
							componentId="results"
							vectorDataField="vector_data"
							size={20}
							candidates={20}
							pagination={true}
							react={{
								and: ['search', 'industries'],
							}}
							includeFields={[
								'name',
								'one_liner',
								'long_description',
								'team_size',
								'stage',
								'industries',
								'website',
								'small_logo_thumb_url',
							]}
							render={({ data }) => (
								<>
									{data.map((item) => {
										const company = item._source || item;
										return (
											<div className="result-item" key={company._id}>
												{company.small_logo_thumb_url && (
													<img
														src={company.small_logo_thumb_url}
														alt={`${company.name} logo`}
														className="company-logo"
													/>
												)}
												<div className="company-info">
													<h3 className="company-name">{company.name}</h3>
													<p className="company-oneliner">
														{company.one_liner ||
															company.long_description}
													</p>
													<div className="company-meta">
														{company.team_size && (
															<span className="meta-item">
																Team: {company.team_size}
															</span>
														)}
														{company.stage && (
															<span className="meta-item">
																Stage: {company.stage}
															</span>
														)}
													</div>
													{company.industries &&
														company.industries.length > 0 && (
															<div className="company-tags">
																{company.industries.map((ind) => (
																	<span className="tag" key={ind}>
																		{ind}
																	</span>
																))}
															</div>
														)}
													{company.website && (
														<a
															href={company.website}
															target="_blank"
															rel="noopener noreferrer"
															className="company-link"
														>
															Visit website
														</a>
													)}
												</div>
											</div>
										);
									})}
								</>
							)}
							renderNoResults={() => <div>No results found</div>}
						/>

						{/* Debug Panel - Shows the queries and responses */}
						<div className="debug-panel">
							<h3>Debug Information</h3>
							<p>
								This example demonstrates vector search using the{' '}
								<code>vectorDataField</code> and <code>candidates</code> props.
							</p>
							<ul>
								<li>
									When you search in the search box, the value is used for the
									vector search
								</li>
								<li>
									The <code>vectorDataField</code> prop points to the vector field
									in your index
								</li>
								<li>
									The <code>candidates</code> prop controls how many nearest
									neighbors to return
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</ReactiveBase>
	);
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
