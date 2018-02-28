import React from 'react';
import ReactDOM from 'react-dom';
import {
	ReactiveBase,
	SelectedFilters,
} from '@appbaseio/reactivesearch';
import {
	ReactiveMap,
	GeoDistanceSlider,
} from '@appbaseio/reactivemaps';

import './index.css';

const Main = () => (
	<ReactiveBase
		app="reactivemap_demo"
		credentials="y4pVxY2Ok:c92481e2-c07f-4473-8326-082919282c18"
		type="meetupdata1"
		mapKey="AIzaSyBQdVcKCe0q_vOBDUvJYpzwGpt_d_uTj4Q"
	>
		<div className="row">
			<div className="col">
				<GeoDistanceSlider
					componentId="GeoDistanceSlider"
					placeholder="Search Location"
					dataField="location"
					unit="mi"
					URLParams
					range={{
						start: 10,
						end: 300,
					}}
				/>
			</div>

			<div className="col">
				<SelectedFilters />
				<ReactiveMap
					componentId="map"
					dataField="location"
					defaultMapStyle="Light Monochrome"
					title="Reactive Maps"
					defaultZoom={13}
					defaultCenter={{ lat: 37.74, lng: -122.45 }}
					react={{
						and: 'GeoDistanceSlider',
					}}
				/>
			</div>
		</div>
	</ReactiveBase>
);

ReactDOM.render(<Main />, document.getElementById('root'));
