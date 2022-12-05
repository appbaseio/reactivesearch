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
				app="carstore-dataset-latest"
				credentials="B86d2y2OE:4fecb2c5-5c5f-49e5-9e0b-0faba74597c6"
			>
				<div className="row">
					<div className="col">
						<SelectedFilters />
						<ReactiveComponent
							componentId="CarSensor"
							defaultQuery={() => ({
								query: { match_all: {} },
							})}
							distinctField="brand.keyword"
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
		if (this.props.data) {
			return this.props.data.map(item => (
				<button
					key={item.brand}
					onClick={() => this.setValue(item.brand)}
					style={{
						display: 'block',
						margin: '5px 0',
					}}
				>
					{item.brand}
				</button>
			));
		}

		return null;
	}
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />);
