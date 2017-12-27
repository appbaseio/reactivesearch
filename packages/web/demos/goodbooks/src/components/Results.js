import React from 'react';
import { ResultCard } from '@appbaseio/reactivesearch';
import PropTypes from 'prop-types';

import Flex, { FlexChild } from '../styles/Flex';
import Topic, { price } from '../styles/Topic';

const onResultStats = (results, time) => (
	<Flex justifyContent="flex-end" style={{ marginTop: '0.6rem' }}>
		{results} results found in {time}ms
	</Flex>
);

const onData = data => ({
	image:
		data.vehicleType === 'other' || data.vehicleType === 'unknown'
			? 'src/images/car.jpg'
			: `src/images/${data.vehicleType.replace(/ /g, '-')}/${data.color}.jpg`,
	title: data.name,
	desc: (<div>
		<div className={price}>${data.price}</div>
		<Flex justifyContent="space-between" responsive>
			<FlexChild>{'⭐'.repeat(data.rating)}</FlexChild>
			<FlexChild>REGD. {data.yearOfRegistration}</FlexChild>
		</Flex>
		<Flex style={{ marginTop: 5 }} flexWrap>
			{data.fuelType && <Topic>{data.fuelType}</Topic>}
			{data.gearbox && <Topic>{data.gearbox}</Topic>}
			{data.vehicleType && <Topic>{data.vehicleType}</Topic>}
		</Flex>
	</div>),
});

const Results = () => (
	<ResultCard
		componentId="results"
		dataField="name"
		onData={onData}
		onResultStats={onResultStats}
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
	/>
);

onData.propTypes = {
	_source: PropTypes.object // eslint-disable-line
};

export default Results;
