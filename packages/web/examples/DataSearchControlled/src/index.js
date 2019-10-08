import React from 'react';
import ReactDOM from 'react-dom';

import {
	ReactiveBase,
	DataSearch,
	ReactiveList,
	ResultCard,
	SelectedFilters,
} from '@appbaseio/reactivesearch';

import './index.css';

class Main extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: '',
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
	}
	handleChange(value) {
		this.setState({
			value,
		});
	}
	handleKeyDown(e, triggerQuery) {
		if (e.key === 'Enter') {
			triggerQuery();
		}
	}
	render() {
		return (
			<ReactiveBase
				app="good-books-ds"
				credentials="nY6NNTZZ6:27b76b9f-18ea-456c-bc5e-3a5263ebc63d"
			>
				<div className="row">
					<div className="col">
						<DataSearch
							title="DataSearch"
							dataField={['original_title', 'original_title.search']}
							categoryField="authors.raw"
							componentId="BookSensor"
							URLParams
							value={this.state.value}
							onChange={this.handleChange}
							onKeyDown={this.handleKeyDown}
							showClear
						/>
					</div>

					<div className="col">
						<SelectedFilters />
						<ReactiveList
							componentId="SearchResult"
							dataField="original_title"
							size={10}
							className="result-list-container"
							pagination
							react={{
								and: 'BookSensor',
							}}
							render={({ data }) => (
								<ReactiveList.ResultCardsWrapper>
									{data.map(item => (
										<ResultCard key={item.id}>
											<ResultCard.Image src={item.image} />
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
														<div>
															by{' '}
															<span className="authors-list">
																{item.authors}
															</span>
														</div>
														<div className="ratings-list flex align-center">
															<span className="stars">
																{Array(item.average_rating_rounded)
																	.fill('x')
																	// eslint-disable-next-line no-shadow
																	.map((item, index) => (
																		<i
																			className="fas fa-star"
																			key={index.toString()}
																		/>
																	)) // eslint-disable-line
																}
															</span>
															<span className="avg-rating">
																({item.average_rating} avg)
															</span>
														</div>
													</div>
													<span className="pub-year">
														Pub {item.original_publication_year}
													</span>
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
	}
}

export default Main;

ReactDOM.render(<Main />, document.getElementById('root'));
