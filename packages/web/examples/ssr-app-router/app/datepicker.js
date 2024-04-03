import React from 'react';
import {
	ReactiveBase,
	DatePicker,
	SelectedFilters,
	ReactiveList,
	ResultCard,
	getServerState,
} from '@appbaseio/reactivesearch';
import PropTypes from 'prop-types';

import moment from 'moment';

import Layout from '../components/Layout';

const dateQuery = (value, props) => {
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
};

const settings = {
	app: 'airbnb-dev',
	url: 'https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io',
	enableAppbase: true,
};

// eslint-disable-next-line no-return-assign
const Main = props => (
	<Layout title="SSR | DatePicker">
		<ReactiveBase
			{...settings}
			{...(props.contextCollector ? { contextCollector: props.contextCollector } : {})}
			initialState={props.initialState}
		>
			<div className="row">
				<div className="col">
					<DatePicker
						componentId="DateSensor"
						dataField="available_from"
						customQuery={dateQuery}
						initialMonth={new Date('2017-05-05')}
						placeholder="Available From - YYYY-MM-DD"
						URLParams
						defaultValue="2017-05-05"
					/>
				</div>

				<div className="col">
					<SelectedFilters />
					<ReactiveList
						componentId="SearchResult"
						dataField="name"
						className="result-list-container"
						from={0}
						size={40}
						// eslint-disable-next-line react/jsx-no-bind, func-names
						render={function ({ data }) {
							return (
								<ReactiveList.ResultCardsWrapper>
									{data.map(item => (
										<ResultCard href={item.listing_url} key={item._id}>
											<ResultCard.Image src={item.picture_url} />
											<ResultCard.Title>{item.name}</ResultCard.Title>
											<ResultCard.Description>
												<div>
													<div>${item.price}</div>
													<span
														style={{
															backgroundImage: `url(${item.picture_url})`,
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
							);
						}}
						react={{ and: ['DateSensor'] }}
						pagination
						URLParams
					/>
				</div>
			</div>
		</ReactiveBase>
	</Layout>
);
export async function getServerSideProps(context) {
	const initialState = await getServerState(Main, context.resolvedUrl);
	return {
		props: { initialState },
		// will be passed to the page component as props
	};
}

Main.propTypes = {
	// eslint-disable-next-line
	initialState: PropTypes.object,
	contextCollector: PropTypes.func,
};
export default Main;
