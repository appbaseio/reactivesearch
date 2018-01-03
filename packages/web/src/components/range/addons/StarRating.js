import React from 'react';
import { number } from '@appbaseio/reactivecore/lib/utils/types';

import Star from './Star';
import { starRow, whiteStar } from '../../../styles/ratingsList';

function StarRating(props) {
	return (
		<div className={starRow}>
			{
				Array(props.stars).fill('').map(() => (
					<Star />
				))
			}
			{
				Array(5 - props.stars).fill('').map(() => (
					<Star className={whiteStar} />
				))
			}
		</div>
	);
}

StarRating.propTypes = {
	stars: number,
};

export default StarRating;
