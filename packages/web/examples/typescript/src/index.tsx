import {
	ReactiveBase,
	ResultList,
	SelectedFilters,
	TextField,
} from "@appbaseio/reactivesearch";
import * as React from "react";
import { render } from "react-dom";

class App extends React.Component<any, any> {
	public render() {
		return (
			<ReactiveBase
				app="good-books-ds"
				credentials="nY6NNTZZ6:27b76b9f-18ea-456c-bc5e-3a5263ebc63d"
			>
				<div className="row">
					<div className="col">
						<TextField
							dataField="original_title.search"
							componentId="BookSensor"
						/>
					</div>

					<div className="col">
						<SelectedFilters />
						<ResultList
							componentId="SearchResult"
							dataField="original_title"
							size={3}
							onData={this.booksList}
							className="result-list-container"
							pagination
						/>
					</div>
				</div>
			</ReactiveBase>
		);
	}

	public booksList(data) {
		return {
			description: (
				<div className="flex column justify-space-between">
					<div>
						<div>by <span className="authors-list">{data.authors}</span></div>
						<div className="ratings-list flex align-center">
							<span className="stars">
								{
									Array(data.average_rating_rounded).fill("x")
										.map((item, index) => <i className="fas fa-star" key={index} />) // eslint-disable-line
								}
							</span>
							<span className="avg-rating">({data.average_rating} avg)</span>
						</div>
					</div>
					<span className="pub-year">Pub {data.original_publication_year}</span>
				</div>
			),
			image: data.image,
			title: <div className="book-title" dangerouslySetInnerHTML={{ __html: data.original_title }} />,
		};
	}
}

function init() {
	render(<App />, document.getElementById("root"));
}

init();
