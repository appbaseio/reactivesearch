/* eslint-disable react/prop-types */
import React from 'react';
import {
	MultiList,
	ReactiveBase,
	ReactiveList,
	SearchBox,
	SelectedFilters,
	getServerState,
} from '@appbaseio/reactivesearch';

const Main = (props) => {
	function booksReactiveList(data) {
		return (
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
									{
										Array(data.average_rating_rounded)
											.fill('x')
											.map((item, index) => (
												// eslint-disable-next-line react/no-array-index-key
												<i className="fas fa-star" key={index} />
											)) // eslint-disable-line
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
	}

	return (
		<ReactiveBase
			app="good-books-ds"
			url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
			enableAppbase
			{...(props.contextCollector ? { contextCollector: props.contextCollector } : {})}
			initialState={props.initialState}
		>
			<div className="row">
				<div className="col">
					<SearchBox componentId="SearchBox" dataField="original_title" URLParams />
					<MultiList
						componentId="BookSensor"
						dataField="original_series.keyword"
						aggregationSize={100}
						URLParams
						react={{
							and: ['SearchBox'],
						}}
					/>
				</div>

				<div className="col">
					<SelectedFilters />
					<ReactiveList
						componentId="SearchResult"
						dataField="original_title"
						className="result-list-container"
						URLParams
						from={0}
						size={5}
						// eslint-disable-next-line react/jsx-no-bind
						renderItem={booksReactiveList}
						react={{
							and: ['BookSensor', 'SearchBox'],
						}}
						pagination
					/>
				</div>
			</div>
		</ReactiveBase>
	);
};
export async function getServerSideProps(context) {
	const initialState = await getServerState(Main, context.resolvedUrl);
	return {
		props: { initialState },
		// will be passed to the page component as props
	};
}

export default Main;
