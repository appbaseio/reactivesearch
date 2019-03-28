import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { ReactiveBase, DataSearch, ResultList, SelectedFilters } from '@appbaseio/reactivesearch';

import './index.css';

class Main extends Component {
	render() {
		return (
			<ReactiveBase
				app="good-books-ds"
				credentials="nY6NNTZZ6:27b76b9f-18ea-456c-bc5e-3a5263ebc63d"
			>
				<div className="row">
					<div className="col">
						<DataSearch
							dataField="original_title.raw"
							componentId="BookSensor"
							defaultValue="Artemis Fowl"
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
						<ResultList
							componentId="SearchResult"
							dataField="original_title"
							from={0}
							size={3}
							renderItem={this.booksList}
							className="result-list-container"
							pagination
							react={{
								and: 'BookSensor',
							}}
						/>
					</div>
				</div>
			</ReactiveBase>
		);
	}

	booksList(data) {
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
