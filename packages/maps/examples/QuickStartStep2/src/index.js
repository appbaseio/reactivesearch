import ReactDOM from 'react-dom/client';
import { Component } from 'react';
import { ReactiveBase, SingleList } from '@appbaseio/reactivesearch';
import { ReactiveGoogleMap } from '@appbaseio/reactivemaps';

class App extends Component {
	render() {
		return (
			<ReactiveBase
				app="earthquakes"
				url="https://reactivesearch-api-9-4-0.onrender.com"
				credentials="d03e6f5f33d5:49124674-554e-4343-9ab2-006b2932f5c0"
				enableAppbase
				mapKey="AIzaSyA9JzjtHeXg_C_hh_GdTBdLxREWdj3nsOU"
			>
				{/* // other components will go here. */}
				<div>
					<SingleList
						title="Places"
						componentId="places"
						dataField="place.keyword"
						size={50}
						showSearch
					/>
					<hr />
					<div style={{ padding: '2rem' }}>
						<ReactiveGoogleMap
							style={{ height: '90vh' }}
							componentId="googleMap"
							dataField="location"
							defaultMapStyle="Light Monochrome"
							title="Reactive Maps"
							defaultZoom={3}
							size={50}
							react={{
								and: 'places',
							}}
							onPopoverClick={(item) => <div>{item.place}</div>}
							showMapStyles={true}
							renderItem={(result) => ({
								custom: (
									<div
										style={{
											background: 'dodgerblue',
											color: '#fff',
											paddingLeft: 5,
											paddingRight: 5,
											borderRadius: 3,
											padding: 10,
										}}
									>
										<i className="fas fa-globe-europe" />
										&nbsp;{result.magnitude}
									</div>
								),
							})}
						/>
					</div>
				</div>
			</ReactiveBase>
		);
	}
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
