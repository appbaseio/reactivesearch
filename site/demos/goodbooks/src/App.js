import React, { Component } from 'react';
import {
	ReactiveBase,
	DataSearch,
	MultiList,
	RangeSlider,
	SingleRange,
	SelectedFilters,
	ResultCard,
	ReactiveList,
} from '@appbaseio/reactivesearch';
import './App.css';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
		};
	}

	toggleState = () => {
		const { visible } = this.state;
		this.setState({
			visible: !visible,
		});
	};

	render() {
		return (
			<ReactiveBase
				app="good-books-ds"
				credentials="nY6NNTZZ6:27b76b9f-18ea-456c-bc5e-3a5263ebc63d"
			>
				<div className="navbar">
					<div className="logo">
						Good<b>Books</b>
					</div>
					<DataSearch
						className="datasearch"
						componentId="mainSearch"
						dataField={[
							'original_title',
							'original_title.search',
							'authors',
							'authors.search',
						]}
						queryFormat="and"
						placeholder="Search for a book title or an author"
						innerClass={{
							input: 'searchbox',
							list: 'suggestionlist',
						}}
						autosuggest={false}
						iconPosition="left"
						filterLabel="search"
					/>
				</div>
				<div className="display">
					<div className={`leftSidebar ${this.state.visible ? 'active' : ''}`}>
						<SingleRange
							componentId="ratingsFilter"
							dataField="average_rating_rounded"
							title="Book Ratings"
							data={[
								{
									start: 4,
									end: 5,
									label: '★★★★ & up',
								},
								{
									start: 3,
									end: 5,
									label: '★★★ & up',
								},
								{
									start: 2,
									end: 5,
									label: '★★ & up',
								},
								{
									start: 1,
									end: 5,
									label: '★ & up',
								},
							]}
							react={{
								and: 'mainSearch',
							}}
							filterLabel="Ratings"
						/>
						<RangeSlider
							componentId="publishFilter"
							dataField="original_publication_year"
							title="Year of Publication"
							filterLabel="published"
							range={{
								start: 1970,
								end: 2017,
							}}
							rangeLabels={{
								start: '1970',
								end: '2017',
							}}
							interval={2}
						/>
						<MultiList
							componentId="authorFilter"
							dataField="authors.raw"
							title="Authors"
							size={100}
							showCheckbox={false}
							className="authors"
							innerClass={{
								list: 'author-list',
							}}
							placeholder="Filter by author name"
							filterLabel="Authors"
						/>
					</div>
					<div className="mainBar">
						<SelectedFilters />
						<ReactiveList
							componentId="results"
							dataField="original_title"
							react={{
								and: [
									'mainSearch',
									'ratingsFilter',
									'publishFilter',
									'authorFilter',
								],
							}}
							pagination
							size={12}
							sortOptions={[
								{
									dataField: 'average_rating',
									sortBy: 'desc',
									label: 'Ratings (High to low)',
								},
								{
									dataField: 'original_title.raw',
									sortBy: 'asc',
									label: 'Title A->Z',
								},
								{
									dataField: 'original_title.raw',
									sortBy: 'desc',
									label: 'Title Z->A',
								},
							]}
							render={({ data }) => (
								<ReactiveList.ResultCardsWrapper>
									{data.map(item => (
										<ResultCard href={item.original_title} key={item._id}>
											<ResultCard.Image src={item.image} />
											<ResultCard.Title>
												{item.original_title || ' '}
											</ResultCard.Title>
											<ResultCard.Description>
												<div className="result-author" title={item.authors}>
													by {item.authors}
												</div>

												<span className="star">
													{'★'.repeat(item.average_rating_rounded)}
												</span>
											</ResultCard.Description>
										</ResultCard>
									))}
								</ReactiveList.ResultCardsWrapper>
							)}
							className="result-data"
							innerClass={{
								title: 'result-title',
								image: 'result-image',
								resultStats: 'result-stats',
								listItem: 'result-item',
							}}
						/>
					</div>
					<div
						role="button"
						tabIndex="0"
						onKeyPress={this.toggleState}
						onClick={this.toggleState}
						className={`toggle-btn ${this.state.visible ? 'active' : ''}`}
					>
						{this.state.visible ? '📚  Show Books' : '📂  Show Filters'}
					</div>
				</div>
			</ReactiveBase>
		);
	}
}

export default App;
