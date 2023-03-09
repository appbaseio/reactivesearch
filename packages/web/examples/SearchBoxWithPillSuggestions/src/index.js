import ReactDOM from 'react-dom/client';
import { useEffect, useRef, useState } from 'react';
import { ReactiveBase, SearchBox, ReactiveList, ResultCard } from '@appbaseio/reactivesearch';

import './index.css';

const Main = () => {
	const [value, setValue] = useState('');
	const triggerQueryRef = useRef(null);

	useEffect(() => {
		if (triggerQueryRef.current) triggerQueryRef.current({ isOpen: true });
	}, [value]);

	return (
		<ReactiveBase
			app="movies-demo-app"
			url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
		>
			<div className="row">
				<div className="col">
					<SearchBox
						title="SearchBox"
						defaultValue={'Free Guy'}
						dataField={['original_title', 'original_title.search']}
						componentId="MoviesSensor"
						value={value}
						onChange={(value, triggerQuery) => {
							triggerQueryRef.current = triggerQuery;
							setValue(value);
						}}
						render={({
							loading,
							error,
							data,
							value,
							downshiftProps: { isOpen, getItemProps },
						}) => {
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
							return isOpen && Boolean(value.length) ? (
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
				</div>

				<div className="col">
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
