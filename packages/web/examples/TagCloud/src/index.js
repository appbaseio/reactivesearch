import ReactDOM from 'react-dom/client';

import {
	ReactiveBase,
	TagCloud,
	ResultList,
	SelectedFilters,
	ReactiveList,
} from '@appbaseio/reactivesearch';

import './index.css';

const Main = () => (
	<ReactiveBase
		app="good-books-ds"
		url="https://reactivesearch-api-9-4-0.onrender.com"
		credentials="d03e6f5f33d5:49124674-554e-4343-9ab2-006b2932f5c0"
	>
		<div className="row">
			<div className="col">
				<TagCloud
					title="TagCloud"
					componentId="LanguageSensor"
					dataField="language_code.keyword"
					multiSelect
					aggregationSize={50}
				/>
			</div>
			<div className="col">
				<SelectedFilters />
				<ReactiveList
					componentId="SearchResult"
					dataField="original_title.keyword"
					title="Results"
					sortBy="asc"
					className="result-list-container"
					from={0}
					size={5}
					pagination
					react={{
						and: ['LanguageSensor'],
					}}
					render={({ data }) => (
						<ReactiveList.ResultListWrapper>
							{data.map(item => (
								<ResultList key={item._id}>
									<ResultList.Image src={item.image} small />
									<ResultList.Content>
										<ResultList.Title>
											<div className="meetup-title">
												{item.original_title}
											</div>
										</ResultList.Title>
										<ResultList.Description>
											<div className="flex column">
												<div className="meetup-location">
													by {item.authors}
												</div>
												<div className="flex wrap meetup-topics">
													<div className="meetup-topic">
														{item.language_code}
													</div>
													<div className="meetup-topic">
														{item.average_rating} stars
													</div>
												</div>
											</div>
										</ResultList.Description>
									</ResultList.Content>
								</ResultList>
							))}
						</ReactiveList.ResultListWrapper>
					)}
				/>
			</div>
		</div>
	</ReactiveBase>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />);
