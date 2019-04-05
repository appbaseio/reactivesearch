import React from 'react';
import { ResultCard, ReactiveList } from '@appbaseio/reactivesearch';

import Flex, { FlexChild } from '../styles/Flex';
import Topic, { price } from '../styles/Topic';

const renderResultStats = ({ numberOfResults, time }) => (
	<Flex justifyContent="flex-end" style={{ marginTop: '0.6rem' }}>
		{numberOfResults} results found in {time}ms
	</Flex>
);

const Results = () => (
	<ReactiveList
		componentId="results"
		dataField="model"
		renderResultStats={renderResultStats}
		react={{
			and: ['category', 'brand', 'rating', 'vehicle', 'price'],
		}}
		innerClass={{
			image: 'card-image',
			pagination: 'pagination',
			listItem: 'card-item',
		}}
		pagination
		size={15}
		render={({ data }) => (
			<ReactiveList.ResultCardWrapper>
				{data.map(item => (
					<ResultCard key={item._id}>
						<ResultCard.Image src={item.image} />
						<ResultCard.Title>{item.model}</ResultCard.Title>
						<ResultCard.Description>
							<div>
								<div className={price}>${item.price}</div>
								<Flex justifyContent="space-between" responsive>
									<FlexChild>{'⭐'.repeat(item.rating)}</FlexChild>
									<FlexChild>REGD. {item.year}</FlexChild>
								</Flex>
								<Flex style={{ marginTop: 5 }} flexWrap>
									{item.fuelType && <Topic>{item.fuelType}</Topic>}
									{item.gearbox && <Topic>{item.gearbox}</Topic>}
									{item.vehicleType && <Topic>{item.vehicleType}</Topic>}
								</Flex>
							</div>
						</ResultCard.Description>
					</ResultCard>
				))}
			</ReactiveList.ResultCardWrapper>
		)}
	/>
);

export default Results;
