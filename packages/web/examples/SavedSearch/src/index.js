import { Component } from 'react';
import ReactDOM from 'react-dom/client';

import {
	ReactiveBase,
	MultiList,
	ReactiveList,
	SelectedFilters,
	SingleRange,
	StateProvider,
} from '@appbaseio/reactivesearch';

import './index.css';

class Main extends Component {
	render() {
		const savedState = {
			BookSensor: ['Meg Cabot', 'Stephen King'],
			Ratings: { start: 4, label: 'Rating > 4' },
		};
		return (
			<ReactiveBase
				app="good-books-ds"
				url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
				enableAppbase
			>
				<StateProvider>
					{({ setSearchState }) => (
						<button
							onClick={() => {
								setSearchState(savedState);
							}}
						>
							Replay State
						</button>
					)}
				</StateProvider>
				<div className="row">
					<div className="col">
						<MultiList
							title="Authors Filter"
							componentId="BookSensor"
							dataField="authors.keyword"
							aggregationSize={100}
							URLParams
						/>
						<SingleRange
							componentId="Ratings"
							title="Ratings Filter"
							dataField="average_rating"
							data={[
								{ start: 0, end: 3, label: 'Rating < 3' },
								{ start: 3, end: 4, label: 'Rating 3 to 4' },
								{ start: 4, end: 5, label: 'Rating > 4' },
							]}
							URLParams
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
							renderItem={this.booksReactiveList}
							react={{
								and: ['BookSensor', 'Ratings'],
							}}
							URLParams
						/>
					</div>
				</div>
			</ReactiveBase>
		);
	}

	booksReactiveList(data) {
		return (
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
									{Array(data.average_rating_rounded)
										.fill('x')
										.map((item, index) => (
											// eslint-disable-next-line
											<i className="fas fa-star" key={index} />
										))}
								</span>
								<span className="avg-rating">({data.average_rating} avg)</span>
							</div>
						</div>
						<span className="pub-year">Pub {data.original_publication_year}</span>
					</div>
				</div>
			</div>
		);
	}
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />);
