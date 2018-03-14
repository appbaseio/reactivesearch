import React from 'react';
import ReactDOM from 'react-dom';
import {
	ReactiveBase,
	SelectedFilters,
} from '@appbaseio/reactivesearch';
import {
	ReactiveMap,
	GeoDistanceDropdown,
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
				<GeoDistanceDropdown
					componentId="GeoDistanceDropdown"
					placeholder="Search Location"
					dataField="location"
					unit="mi"
					URLParams
					data={[
						{ distance: 100, label: 'Under 100 miles' },
						{ distance: 200, label: 'Under 200 miles' },
						{ distance: 500, label: 'Under 500 miles' },
						{ distance: 1000, label: 'Under 1000 miles' },
					]}
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
						and: 'GeoDistanceDropdown',
					}}
				/>
			</div>
		</div>
	</ReactiveBase>
);

ReactDOM.render(<Main />, document.getElementById('root'));
