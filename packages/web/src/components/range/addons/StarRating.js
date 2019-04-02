import React from 'react';
import types from '@appbaseio/reactivecore/lib/utils/types';
import { element } from 'prop-types';

import Star from './Star';
import { starRow, whiteStar } from '../../../styles/ratingsList';

function StarRating(props) {
	const { icon, dimmedIcon } = props;
	return (
		<div className={starRow}>
			{Array(props.stars)
				.fill('')
				.map((_, index) =>
					(icon ? (
						<React.Fragment key={index}>{icon}</React.Fragment> // eslint-disable-line
					) : (
						<Star key={index} /> // eslint-disable-line
					)),
				)}
			{Array(5 - props.stars)
				.fill('')
				.map((_, index) =>
					(dimmedIcon ? (
						<React.Fragment key={index}>{dimmedIcon}</React.Fragment> // eslint-disable-line
					) : (
						<Star key={index} className={whiteStar} /> // eslint-disable-line
					)),
				)}
		</div>
	);
}

StarRating.propTypes = {
	stars: types.number,
	icon: element,
	dimmedIcon: element,
};

export default StarRating;
