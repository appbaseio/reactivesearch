import ReactDOM from 'react-dom/client';
import { useEffect, useRef, useState } from 'react';
import { ReactiveBase, SearchBox, ReactiveList, ResultCard } from '@appbaseio/reactivesearch';

import './index.css';

const Main = () => {

	return (
		<ReactiveBase
			app="movies-demo-app"
			url="https://reactivesearch-api-9-4-0.onrender.com"
			credentials="d03e6f5f33d5:49124674-554e-4343-9ab2-006b2932f5c0"
		>
			<div className="row">
				<div className="col">
					<SearchBox
						title="SearchBox with pill suggestions"
						defaultValue={'Free Guy'}
						dataField={['original_title', 'original_title.search']}
						componentId="MoviesSensor"
						autosuggest
						showClear
						render={({
							loading,
							error,
							data,
							value,
							downshiftProps: { getItemProps, isOpen },
						}) => {
							if(!isOpen){
								return null
							}
							if (loading) {
								return <div>Fetching Suggestions.</div>;
							}
							if (error) {
								return (
									<div>
										Something went wrong! Error details {JSON.stringify(error)}
									</div>
								);
							}
							return Boolean(value.length) ? (
								<div className="pill-wrapper">
									{data.map((suggestion, index) => (
										<button
											className="pill-btn"
											key={suggestion.value}
											title={suggestion.value}
											{...getItemProps({ item: suggestion })}
											dangerouslySetInnerHTML={{
												__html: suggestion.value,
											}}
										></button>
									))}
								</div>
							) : null;
						}}
					/>
					<br />
					<ReactiveList
						componentId="SearchResult"
						dataField="original_title"
						size={10}
						className="result-list-container"
						pagination
						react={{
							and: 'MoviesSensor',
						}}
						render={({ data }) => (
							<ReactiveList.ResultCardsWrapper>
								{data.map((item) => (
									<ResultCard id={item._id} key={item._id}>
										<ResultCard.Image src={item.poster_path} />
										<ResultCard.Title>
											<div
												className="book-title"
												dangerouslySetInnerHTML={{
													__html: item.original_title,
												}}
											/>
										</ResultCard.Title>

										<ResultCard.Description>
											<div className="flex column justify-space-between">
												<div>
													<div title={item.overview}>
														<span className="authors-list">
															{item.overview}
														</span>
													</div>
													<div className="ratings-list flex align-center">
														<span>
															{item.genres.map((_) => (
																<span> ∙ {_}</span>
															))}
														</span>
													</div>
												</div>
											</div>
										</ResultCard.Description>
									</ResultCard>
								))}
							</ReactiveList.ResultCardsWrapper>
						)}
					/>
				</div>
			</div>
		</ReactiveBase>
	);
};
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />);
