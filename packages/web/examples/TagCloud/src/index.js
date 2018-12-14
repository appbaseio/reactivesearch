import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { ReactiveBase, TagCloud, ResultList, SelectedFilters } from '@appbaseio/reactivesearch';

import './index.css';

class Main extends Component {
	render() {
		return (
			<ReactiveBase
				app="Movies_JY"
				credentials="k1meXR4WG:7b5c21f3-6e11-4140-9f7a-a05b46f5f245"
			>
				<div className="row">
					<div className="col">
						<TagCloud
							title="TagCloud"
							nestedField="nested"
							componentId="CitySensor"
							dataField="nested.genre.keyword"
							multiSelect
							size={50}
						/>
					</div>
					<div className="col">
						<SelectedFilters />
						<ResultList
							componentId="SearchResult"
							dataField="original_title.keyword"
							title="Results"
							sortBy="asc"
							className="result-list-container"
							from={0}
							size={5}
							onData={this.meetupList}
							innerClass={{
								image: 'meetup-list-image',
							}}
							pagination
							react={{
								and: ['CitySensor'],
							}}
						/>
					</div>
				</div>
			</ReactiveBase>
		);
	}

	meetupList(data) {
		return {
			title: <div className="meetup-title">{data.original_title}</div>,
		};
	}
}

ReactDOM.render(<Main />, document.getElementById('root'));
