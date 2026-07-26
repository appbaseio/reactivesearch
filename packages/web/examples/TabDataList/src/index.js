import ReactDOM from 'react-dom/client';

import {
	ReactiveBase,
	ResultList,
	SelectedFilters,
	ReactiveList,
	TabDataList,
} from '@appbaseio/reactivesearch';

import './index.css';

const languageOptions = [
	{ label: 'English', value: 'eng' },
	{ label: 'French', value: 'fre' },
	{ label: 'Spanish', value: 'spa' },
	{ label: 'German', value: 'ger' },
];

const Main = () => (
	<ReactiveBase
		app="good-books-ds"
		url="https://reactivesearch-api-9-4-0.onrender.com"
		credentials="d03e6f5f33d5:49124674-554e-4343-9ab2-006b2932f5c0"
	>
		<div className="container">
			<SelectedFilters />
			<TabDataList
				title="Filter by Language"
				componentId="LanguageSensor"
				dataField="language_code.keyword"
				data={languageOptions}
				showCount
			/>
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
								<ResultList.Image small src={item.image || ''} />
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
	</ReactiveBase>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />);
