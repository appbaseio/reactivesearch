import React from 'react';
import ReactDOM from 'react-dom';
import {
	ReactiveBase,
	SingleList,
	SelectedFilters,
} from '@appbaseio/reactivesearch';
import { ReactiveMap } from '@appbaseio/reactivemaps';

import './index.css';

const Main = () => (
	<ReactiveBase
		app="earthquake"
		credentials="OrXIHcgHn:d539c6e7-ed14-4407-8214-c227b0600d8e"
		type="places"
		mapKey="AIzaSyBQdVcKCe0q_vOBDUvJYpzwGpt_d_uTj4Q"
	>
		<div className="row">
			<div className="col">
				<SingleList
					title="Places"
					componentId="places"
					dataField="place.raw"
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
						label: result.mag,
					})}
					onPopoverClick={() => <div>wasssssssaaaa</div>}
					autoClosePopover
				/>
			</div>
		</div>
	</ReactiveBase>
);

ReactDOM.render(<Main />, document.getElementById('root'));
