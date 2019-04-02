import React from 'react';
import types from '@appbaseio/reactivecore/lib/utils/types';

import Star from './Star';
import { starRow, whiteStar } from '../../../styles/ratingsList';

function StarRating(props) {
	const { showDimmedStars } = props;
	return (
		<div className={starRow}>
			{Array(props.stars)
				.fill('')
				.map((item, index) => (
					<Star key={index} /> // eslint-disable-line
				))}
			{showDimmedStars
				? Array(5 - props.stars)
					.fill('')
					.map((item, index) => (
							<Star key={index} className={whiteStar} /> // eslint-disable-line
					))
				: null}
		</div>
	);
}

StarRating.propTypes = {
	stars: types.number,
	showDimmedStars: types.bool,
};

export default StarRating;
