import ReactDOM from 'react-dom/client';

import {
	ReactiveBase,
	ToggleButton,
	SelectedFilters,
	ReactiveList,
} from '@appbaseio/reactivesearch';

import './index.css';

const booksReactiveList = data => (
	<div className="flex book-content" key={data._id}>
		<img src={data.image} alt="Book Cover" className="book-image" />
		<div className="flex column justify-center" style={{ marginLeft: 20 }}>
			<div className="book-header">{data.original_title}</div>
			<div className="flex column justify-space-between">
				<div>
					<div>
						by <span className="authors-list">{data.authors}</span>
					</div>
					<div className="ratings-list flex align-center">
						<span className="stars">
							{
								Array(data.average_rating_rounded)
									.fill('x')
									.map((item, index) => (
										<i className="fas fa-star" key={index} />
									)) // eslint-disable-line
							}
						</span>
						<span className="avg-rating">({data.average_rating} avg)</span>
					</div>
				</div>
				<span className="pub-year">Pub {data.original_publication_year}</span>
			</div>
		</div>
	</div>
);

const Main = () => (
	<ReactiveBase
		app="good-books-ds"
		url="https://reactivesearch-api-9-4-0.onrender.com"
		credentials="d03e6f5f33d5:49124674-554e-4343-9ab2-006b2932f5c0"
	>
		<div className="row">
			<div className="col">
				<ToggleButton
					componentId="LanguageSensor"
					dataField="language_code"
					data={[
						{ label: 'English', value: 'eng' },
						{ label: 'French', value: 'fre' },
						{ label: 'Spanish', value: 'spa' },
					]}
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
					renderItem={booksReactiveList}
				/>
			</div>
		</div>
	</ReactiveBase>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />);
