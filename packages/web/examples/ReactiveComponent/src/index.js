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
				app="carstore-dataset"
				url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
				enableAppbase
			>
				<div className="row">
					<div className="col">
						<SelectedFilters />
						<ReactiveComponent
							componentId="CarSensor"
							// either use customQuery or defaultQuery
							// customQuery={() => ({
							// 	query: {
							// 		term: {
							// 			'brand.keyword': 'Nissan',
							// 		},
							// 	},
							// })}
							defaultQuery={() => ({
								aggs: {
									'brand.keyword': {
										terms: {
											field: 'brand.keyword',
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
							dataField="model"
							title="ReactiveList"
							from={0}
							size={20}
							renderItem={this.renderData}
							pagination
							react={{
								and: 'CarSensor',
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
				<h2>{data.name}</h2>
				<p>
					{data.price} - {data.rating} stars rated
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
					'brand.keyword': value,
				},
			},
			value,
		});
	}

	render() {
		if (this.props.aggregations) {
			return this.props.aggregations['brand.keyword'].buckets.map(item => (
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
