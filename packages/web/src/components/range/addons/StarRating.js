import React from 'react';
import types from '@appbaseio/reactivecore/lib/utils/types';

import Star from './Star';
import { starRow, whiteStar } from '../../../styles/ratingsList';

function StarRating(props) {
	return (
		<div className={starRow}>
			{Array(props.stars)
				.fill('')
				.map((item, index) => (
					<Star key={index} /> // eslint-disable-line
				))}
			{Array(5 - props.stars)
				.fill('')
				.map((item, index) => (
					<Star key={index} className={whiteStar} /> // eslint-disable-line
				))}
		</div>
	);
}

StarRating.propTypes = {
	stars: types.number,
};

export default StarRating;
