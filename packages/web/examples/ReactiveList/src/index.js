import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { ReactiveBase, MultiDropdownList, ReactiveList } from '@appbaseio/reactivesearch';

import './index.css';

class Main extends Component {
	render() {
		return (
			<ReactiveBase
				app="good-books-ds"
				url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@arc-cluster-appbase-demo-6pjy6z.searchbase.io"
				enableAppbase
			>
				<div className="row">
					<div className="col">
						<MultiDropdownList
							title="MultiDropdownList"
							componentId="BookSensor"
							dataField="original_series.keyword"
							size={100}
						/>
					</div>

					<div className="col">
						<ReactiveList
							componentId="SearchResult"
							dataField="original_title"
							className="result-list-container"
							size={5}
							renderItem={this.booksReactiveList}
							pagination
							URLParams
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
	}
}

ReactDOM.render(<Main />, document.getElementById('root'));
