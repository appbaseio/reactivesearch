import ReactDOM from 'react-dom/client';
import { Component } from 'react';
import moment from 'moment';
import {
	ReactiveBase,
	DateRange,
	ResultCard,
	SelectedFilters,
	ReactiveList,
} from '@appbaseio/reactivesearch';

import './index.css';

class Main extends Component {
	dateQuery(value) {
		let query = null;
		if (value) {
			query = [
				{
					range: {
						available_from: {
							gte: moment(value.start).valueOf(),
						},
					},
				},
				{
					range: {
						available_to: {
							lte: moment(value.end).valueOf(),
						},
					},
				},
			];
		}
		return query ? { query: { bool: { must: query } } } : null;
	}

	render() {
		return (
			<ReactiveBase
				app="airbnb-dev"
				url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
				enableAppbase
			>
				<div className="row">
					<div className="col">
						<DateRange
							componentId="DateSensor"
							dataField="available_from"
							customQuery={this.dateQuery}
							initialMonth={new Date('2021-05-05')}
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
									{data.map((item) => (
										<ResultCard href={item.listing_url} key={item.id}>
											<ResultCard.Image src={item.picture_url} />
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
															backgroundImage: `url(${item.host_image})`,
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
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />);
