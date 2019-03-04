import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { ReactiveBase, DataSearch, ResultList, SelectedFilters } from '@appbaseio/reactivesearch';

import { createStore } from 'redux';
import { Provider } from 'react-redux';
import App from './components/App';
import reducer from './reducers';
import './index.css';

const store = createStore(reducer);

class Main extends Component {
	render() {
		return (
			<Provider store={store}>
				<ReactiveBase
					app="good-books-ds"
					credentials="nY6NNTZZ6:27b76b9f-18ea-456c-bc5e-3a5263ebc63d"
				>
					<div className="row">
						<div className="col">
							<div>
								<App />
								<DataSearch
									title="DataSearch"
									dataField={['original_title', 'original_title.search']}
									categoryField="authors.raw"
									componentId="BookSensor"
								/>
							</div>
						</div>

						<div className="col">
							<SelectedFilters />
							<ResultList
								componentId="SearchResult"
								dataField="original_title"
								size={10}
								onData={this.onData}
								className="result-list-container"
								pagination
								react={{
									and: 'BookSensor',
								}}
							/>
						</div>
					</div>
				</ReactiveBase>
			</Provider>
		);
	}

	onData(data) {
		return {
			title: (
				<div
					className="book-title"
					dangerouslySetInnerHTML={{ __html: data.original_title }}
				/>
			),
			description: (
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
										<i className="fas fa-star" key={index} />
									)) // eslint-disable-line
								}
							</span>
							<span className="avg-rating">({data.average_rating} avg)</span>
						</div>
					</div>
					<span className="pub-year">Pub {data.original_publication_year}</span>
				</div>
			),
			image: data.image,
		};
	}
}

ReactDOM.render(<Main />, document.getElementById('root'));
