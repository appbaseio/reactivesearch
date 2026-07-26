/* eslint react/prop-types: 0 */
import { Component } from 'react';
import ReactDOM from 'react-dom/client';

import {
	ReactiveBase,
	ReactiveComponent,
	ReactiveList,
	SelectedFilters,
} from '@appbaseio/reactivesearch';

import './index.css';

class Main extends Component {
	render() {
		return (
			<ReactiveBase
				app="good-books-ds"
				url="https://reactivesearch-api-9-4-0.onrender.com"
				credentials="d03e6f5f33d5:49124674-554e-4343-9ab2-006b2932f5c0"
			>
				<div className="row">
					<div className="col">
						<SelectedFilters />
						<ReactiveComponent
							componentId="AuthorSensor"
							defaultQuery={() => ({
								query: { match_all: {} },
							})}
							distinctField="authors.keyword"
						>
							{props => <CustomComponent {...props} />}
						</ReactiveComponent>
					</div>

					<div className="col">
						<ReactiveList
							componentId="SearchResult"
							dataField="original_title.keyword"
							title="ReactiveList"
							from={0}
							size={20}
							renderItem={this.renderData}
							pagination
							react={{
								and: 'AuthorSensor',
							}}
						/>
					</div>
				</div>
			</ReactiveBase>
		);
	}

	renderData(data) {
		return (
			<div key={data._id}>
				<h2>{data.original_title}</h2>
				<p>
					{data.authors} - {data.average_rating} stars rated
				</p>
			</div>
		);
	}
}

/* eslint react/no-multi-comp: 0 */
class CustomComponent extends Component {
	setValue(value) {
		this.props.setQuery({
			query: {
				term: {
					'authors.keyword': value,
				},
			},
			value,
		});
	}
	render() {
		if (this.props.data) {
			return this.props.data.map(item => (
				<button
					key={item.authors}
					onClick={() => this.setValue(item.authors)}
					style={{
						display: 'block',
						margin: '5px 0',
					}}
				>
					{item.authors}
				</button>
			));
		}

		return null;
	}
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />);
