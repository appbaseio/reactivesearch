import React from 'react';
import { ReactiveBase, DataSearch } from '@appbaseio/reactivesearch';
import { GeoDistanceDropdown, ReactiveGoogleMap } from '@appbaseio/reactivemaps';

import { header, filters, listContainer, mapContainer } from '../styles';

export default () => (
	<div>
		<ReactiveBase
			app="meetup_dataset"
			url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
			enableAppbase
			type="meetupdata1"
			mapKey="AIzaSyAKz3UhgSuP872fb-Aw27oPRI7M0eXkA9U"
			theme={{
				typography: {
					fontFamily: 'Varela Round',
				},
				colors: {
					primaryColor: '#f64060',
				},
			}}
		>
			<div className={header}>
				<h1>Who&apos;s in town</h1>

				<div className={filters}>
					<DataSearch
						componentId="search"
						dataField={['group.group_topics.topic_name_raw', 'venue_name_ngrams']}
						autosuggest={false}
						placeholder="Search for meetups..."
						iconPosition="left"
						className="search"
					/>

					<GeoDistanceDropdown
						componentId="distance"
						dataField="location"
						placeholder="In location"
						iconPosition="left"
						unit="mi"
						className="geo"
						data={[
							{ distance: 10, label: 'Within 10 miles' },
							{ distance: 100, label: 'Within 100 miles' },
							{ distance: 250, label: 'Within 250 miles' },
							{ distance: 500, label: 'Within 500 miles' },
						]}
						defaultSelected={{
							location: 'London',
							label: 'Within 10 miles',
						}}
					/>
				</div>
			</div>

			<ReactiveGoogleMap
				componentId="map"
				dataField="location"
				defaultZoom={13}
				pagination
				onPageChange={() => {
					document.getElementById('list').scrollTo(0, 0);
				}}
				style={{
					position: 'fixed',
					width: '100%',
					height: 'calc(100vh - 168px)',
					top: '168px',
				}}
				showMarkerClusters={false}
				renderAllData={(hits, streamHits, loadMore, renderMap, renderPagination) => (
					<div style={{ display: 'flex' }}>
						<div id="list" className={listContainer}>
							{hits.map(data => (
								<div key={data._id} className="user">
									<div
										className="user__image"
										style={{ backgroundImage: `url(${data.member.photo})` }}
										alt={data.name}
									/>
									<div className="user__info">
										<h3>
											{data.member.member_name} is going to{' '}
											{data.event.event_name}
										</h3>
										<p>{data.venue_name_ngrams}</p>
									</div>
								</div>
							))}
							{renderPagination()}
						</div>
						<div className={mapContainer}>{renderMap()}</div>
					</div>
				)}
				renderData={data => ({
					label: (
						<span
							style={{
								width: `${
									data.member.member_name
										? data.member.member_name.length * 8
										: 40
								}px`,
								minWidth: 60,
								display: 'block',
								textAlign: 'center',
							}}
						>
							{data.member.member_name}
						</span>
					),
				})}
				react={{
					and: ['search', 'distance'],
				}}
				innerClass={{
					label: 'checkbox-label',
				}}
			/>
		</ReactiveBase>
	</div>
);
