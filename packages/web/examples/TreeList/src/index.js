import { Component } from 'react';
import ReactDOM from 'react-dom/client';

import { ReactiveBase, TreeList, ReactiveList, SelectedFilters } from '@appbaseio/reactivesearch';

import './index.css';

class Main extends Component {
	render() {
		return (
			<ReactiveBase
				app="best-buy-dataset"
				url="https://reactivesearch-api-9-4-0.onrender.com"
				credentials="d03e6f5f33d5:49124674-554e-4343-9ab2-006b2932f5c0"
			>
				<div className="row">
					<div className="col">
						<TreeList
							componentId="BookSensor"
							showCount
							title="TreeList UI"
							showCheckbox
							mode="multiple"
							URLParams
							dataField={['class.keyword', 'subclass.keyword']}
						/>
					</div>

					<div className="col">
						<SelectedFilters />
						<ReactiveList
							componentId="SearchResult"
							dataField="original_title"
							className="result-list-container"
							from={0}
							size={5}
							renderItem={this.reactiveList}
							react={{
								and: ['BookSensor'],
							}}
							defaultQuery={() => ({
								track_total_hits: true,
							})}
							includeFields={['class', 'subclass', 'name', 'image', 'salePrice']}
						/>
					</div>
				</div>
			</ReactiveBase>
		);
	}

	reactiveList(data) {
		return (
			<div className="flex book-content" key={data._id}>
				<img src={data.image} alt="Book Cover" className="book-image" />
				<div className="flex column justify-center" style={{ marginLeft: 20 }}>
					<div className="book-header">{data.name}</div>
					<div className="flex column justify-space-between">
						<div>
							<div>
								<span className="authors-list">
									{data.class} > {data.subclass}
								</span>
							</div>
							<div className="ratings-list flex align-center">
								Sale Price 💰 <b>{data.salePrice}</b>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />);
