import React from 'react';
import PropTypes from 'prop-types';

const BookCard = ({ data }) => (
	<div className="flex book-content" key={data._id}>
		<img src={data.image} alt="Book Cover" className="book-image" />
		<div className="flex column justify-center" style={{ marginLeft: 20 }}>
			<div className="book-header">{data.original_title}</div>
			<div className="flex column justify-space-between">
				<div>
					<div>
						by <span className="authors-list">{data.authors}</span>
					</div>
					<div className="ratings-list flex align-center">
						<span className="stars">
							{Array(data.average_rating_rounded)
								.fill('x')
								.map((item, index) => <i className="fas fa-star" key={index} />) // eslint-disable-line
							}
						</span>
						<span className="avg-rating">({data.average_rating} avg)</span>
					</div>
				</div>
				<span className="pub-year">Pub {data.original_publication_year}</span>
			</div>
		</div>
	</div>
);

BookCard.propTypes = {
	data: PropTypes.any, // eslint-disable-line
};

export default BookCard;
