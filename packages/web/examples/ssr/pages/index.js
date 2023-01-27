import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
	ReactiveBase,
	SearchBox,
	MultiList,
	RangeSlider,
	ReactiveList,
	SelectedFilters,
} from '@appbaseio/reactivesearch';
import initReactivesearch from '@appbaseio/reactivesearch/lib/server';
import { components } from './utils/index';

const Main = ({ store }) => {
	const [isClicked, setIsClicked] = useState(false);
	const [message, setMessage] = useState('🔬 Show Filters');

	const handleClick = () => {
		setIsClicked(!isClicked);
		setMessage(isClicked ? '🔬 Show Filters' : '🎬 Show Movies');
	};

	return (
		<div className="main-container">
			<ReactiveBase {...components.settings} initialState={store}>
				<div className="navbar">
					<div className="header-container">
						<span role="img" aria-label="movies-emoji">
							🎥
						</span>{' '}
						MovieSearch
					</div>

					<div className="search-container">
						<SearchBox {...components.searchbox} />
					</div>
					<div className="sub-container">
						<div className={isClicked ? 'left-bar-optional' : 'left-bar'}>
							<div className="filter-heading center">
								<b>
									{' '}
									<i className="fa fa-pied-piper-alt" /> Genres{' '}
								</b>
							</div>

							<MultiList {...components.multiList} className="genres-filter" />
							<hr className="blue" />

							<div className="filter-heading center">
								<b>
									<i className="fa fa-star" /> Ratings
								</b>
							</div>
							<RangeSlider {...components.rangeSlider} className="review-filter" />
						</div>

						<div
							className={isClicked ? 'result-container-optional' : 'result-container'}
						>
							<SelectedFilters
								showClearAll
								clearAllLabel="Clear filters"
								className="selected-filters"
							/>
							<ReactiveList {...components.resultcard} />
						</div>
					</div>
				</div>
			</ReactiveBase>
			<button className="toggle-button" onClick={handleClick}>
				{message}
			</button>
		</div>
	);
};

// eslint-disable-next-line
Main.getInitialProps = async ({ query }) => {
	return {
		store: await initReactivesearch(
			[
				{
					...components.searchbox,
					source: SearchBox,
				},
				{
					...components.multiList,
					source: MultiList,
				},
				{
					...components.rangeSlider,
					source: RangeSlider,
				},
				{
					...components.resultcard,
					source: ReactiveList,
				},
			],
			query,
			components.settings,
		),
	};
};

Main.propTypes = {
	store: PropTypes.oneOf([PropTypes.object]),
};

export default Main;
