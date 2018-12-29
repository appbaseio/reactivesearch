import React from 'react';
import ReactDOM from 'react-dom';
import { ReactiveBase, SingleList, SelectedFilters } from '@appbaseio/reactivesearch';
import { ReactiveMap } from '@appbaseio/reactivemaps';

import './index.css';

const Main = () => (
	<ReactiveBase
		app="earthquakes"
		credentials="dshr057Nz:e18bbbbe-5d55-4234-a17e-4d64fb2222c7"
		mapKey="AIzaSyBQdVcKCe0q_vOBDUvJYpzwGpt_d_uTj4Q"
	>
		<div className="row">
			<div className="col">
				<SingleList
					title="Places"
					componentId="places"
					dataField="place.keyword"
					size={50}
					showSearch
				/>
			</div>
			<div className="col">
				<SelectedFilters />
				<ReactiveMap
					componentId="map"
					dataField="location"
					react={{
						and: 'places',
					}}
					onData={result => ({
						label: result.magnitude,
					})}
					onPopoverClick={() => <div>wasssssssaaaa</div>}
					autoClosePopover
				/>
			</div>
		</div>
	</ReactiveBase>
);

ReactDOM.render(<Main />, document.getElementById('root'));
