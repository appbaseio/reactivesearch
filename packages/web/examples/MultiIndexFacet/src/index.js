import ReactDOM from 'react-dom/client';
import { Component } from 'react';
import { ReactiveBase, MultiList, ReactiveList, SelectedFilters } from '@appbaseio/reactivesearch';

import './index.css';

class Main extends Component {
	render() {
		return (
			<ReactiveBase
				app="good-books-ds,good-books-authors"
				url="https://reactivesearch-api-9-4-0.onrender.com"
				credentials="d03e6f5f33d5:49124674-554e-4343-9ab2-006b2932f5c0"
			>
				<div className="row">
					<div className="col">
						<MultiList
							componentId="BookSensor"
							dataField="author_name.keyword"
							index="good-books-authors"
							// customQuery: If none is selected then match all documents else match selected
							customQuery={(value) =>
								value.length
									? {
											query: {
												terms: {
													'authors.keyword': value,
												},
											},
									  }
									: {
											query: {
												match_all: {},
											},
									  }
							}
							aggregationSize={100}
						/>
					</div>

					<div className="col">
						<SelectedFilters />
						<ReactiveList
							componentId="SearchResult"
							dataField="original_title"
							className="result-list-container"
							index="good-books-ds"
							from={0}
							size={5}
							renderItem={this.booksReactiveList}
							react={{
								and: ['BookSensor'],
							}}
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
											/* eslint-disable-next-line */
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
