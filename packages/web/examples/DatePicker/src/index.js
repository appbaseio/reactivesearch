import ReactDOM from 'react-dom/client';
import { Component } from 'react';
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
				app="clone-airbeds"
				url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
				type="listing"
			>
				<div className="row">
					<div className="col">
						<DatePicker
							componentId="DateSensor"
							dataField="available_from"
							initialMonth={new Date('2016-05-05')}
							placeholder="Available From - YYYY-MM-DD"
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

	dateQuery(value, props) {
		let query = null;
		if (value) {
			query = [
				{
					range: {
						[props.dataField]: {
							gte: moment(value).valueOf(),
						},
					},
				},
			];
		}
		return query ? { query: { bool: { must: query } } } : null;
	}
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />);
