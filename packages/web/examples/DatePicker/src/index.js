import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

import {
	ReactiveBase,
	DatePicker,
	ResultCard,
	SelectedFilters,
	ReactiveList,
} from '@appbaseio/reactivesearch';

import './index.css';

class Main extends Component {
	render() {
		return (
			<ReactiveBase
				app="airbeds-test-app"
				credentials="X8RsOu0Lp:9b4fe1a4-58c6-4089-a042-505d86d9da30"
				type="listing"
			>
				<div className="row">
					<div className="col">
						<DatePicker
							componentId="DateSensor"
							dataField="date_from"
							customQuery={this.dateQuery}
							initialMonth={new Date('2017-05-05')}
						/>
					</div>

					<div className="col">
						<SelectedFilters />
						<ReactiveList
							componentId="SearchResult"
							dataField="name"
							from={0}
							size={40}
							showPagination
							react={{
								and: ['DateSensor'],
							}}
							render={({ data }) => (
								<ReactiveList.ResultCardsWrapper>
									{data.map(item => (
										<ResultCard href={item.listing_url} key={item.id}>
											<ResultCard.Image src={item.image} />
											<ResultCard.Title>
												<div
													className="book-title"
													dangerouslySetInnerHTML={{
														__html: item.name,
													}}
												/>
											</ResultCard.Title>

											<ResultCard.Description>
												<div>
													<div>${item.price}</div>
													<span
														style={{
															backgroundImage: `url(${
																item.host_image
															})`,
														}}
													/>
													<p>
														{item.room_type} · {item.accommodates}{' '}
														guests
													</p>
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

	dateQuery(value, props) {
		let query = null;
		if (value) {
			query = [
				{
					range: {
						[props.dataField]: {
							lte: moment(value).format('YYYYMMDD'),
						},
					},
				},
			];
		}
		return query ? { query: { bool: { must: query } } } : null;
	}
}

ReactDOM.render(<Main />, document.getElementById('root'));
