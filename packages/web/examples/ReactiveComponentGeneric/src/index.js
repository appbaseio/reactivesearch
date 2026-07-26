/* eslint react/prop-types: 0 */
import { Component } from 'react';
import ReactDOM from 'react-dom/client';

import {
	ReactiveBase,
	ReactiveComponent,
	ReactiveList,
	SelectedFilters,
	componentTypes,
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
							componentType={componentTypes.singleList}
							componentId="BookSensor"
							dataField="authors.keyword"
							aggregationSize={100}
						/>
						<ReactiveComponent
							componentId="LanguageSensor"
							componentType={componentTypes.reactiveComponent}
							defaultQuery={() => ({
								aggs: {
									'language_code.keyword': {
										terms: {
											field: 'language_code.keyword',
											order: {
												_count: 'desc',
											},
											size: 10,
										},
									},
								},
							})}
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
								and: 'LanguageSensor',
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
					'language_code.keyword': value,
				},
			},
			value,
		});
	}

	render() {
		if (this.props.aggregations) {
			return this.props.aggregations['language_code.keyword'].buckets.map(item => (
				<button
					key={item.key}
					onClick={() => this.setValue(item.key)}
					style={{
						display: 'block',
						margin: '5px 0',
					}}
				>
					{item.key}
				</button>
			));
		}

		return null;
	}
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />);
