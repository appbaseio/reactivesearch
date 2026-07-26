import React from 'react';
import {
	ReactiveBase,
	SelectedFilters,
	ReactiveList,
	ResultCard,
	DateRange,
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
						lte: moment(value.end).valueOf(),
						gte: moment(value.start).valueOf(),
					},
				},
			},
		];
	}
	return query ? { query: { bool: { must: query } } } : null;
};

const settings = {
	app: 'airbnb-dev',
	url: 'https://reactivesearch-api-9-4-0.onrender.com',
	credentials: 'd03e6f5f33d5:49124674-554e-4343-9ab2-006b2932f5c0',
	enableAppbase: true,
};

// eslint-disable-next-line no-return-assign
const Main = props => (
	<Layout title="SSR | DateRange">
		<ReactiveBase
			{...settings}
			{...(props.contextCollector ? { contextCollector: props.contextCollector } : {})}
			initialState={props.initialState}
		>
			<div className="row">
				<div className="col">
					<DateRange
						componentId="DateSensor"
						dataField="available_from"
						initialMonth={new Date('2021-05-05')}
						customQuery={dateQuery}
						defaultValue={{
							start: new Date('2022-04-07'),
							end: new Date('2022-05-26'),
						}}
						URLParams
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
