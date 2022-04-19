/* eslint-disable react/prop-types */
import React from 'react';
import { ReactiveBase, DataSearch } from '@appbaseio/reactivesearch';
import { ReactiveGoogleMap } from '@appbaseio/reactivemaps';

import { nav, container, rightCol, search, title } from '../styles';
import Filters from './Filters';

export default () => (
	<div className={container}>
		<ReactiveBase
			app="airbeds-test-app"
			url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
			enableAppbase
			theme={{
				colors: {
					primaryColor: '#FF3A4E',
				},
			}}
			mapKey="AIzaSyA9JzjtHeXg_C_hh_GdTBdLxREWdj3nsOU"
		>
			<nav className={nav}>
				<div className={title}>airbeds</div>

				<DataSearch
					componentId="search"
					dataField="name"
					autosuggest={false}
					placeholder="Search housings..."
					iconPosition="left"
					className={search}
				/>
			</nav>
			<Filters />

			<ReactiveGoogleMap
				componentId="map"
				dataField="location"
				defaultZoom={13}
				pagination
				onPageChange={() => {
					window.scrollTo(0, 0);
				}}
				style={{
					width: 'calc(100% - 280px)',
					height: 'calc(100vh - 52px)',
				}}
				className={rightCol}
				showMarkerClusters={false}
				showSearchAsMove={false}
				render={(props) => {
					// eslint-disable-next-line react/prop-types
					const { data: hits, renderMap, renderPagination } = props;
					return (
						<div style={{ display: 'flex' }}>
							<div className="card-container">
								{hits.map(data => (
									<div key={data._id} className="card">
										<div
											className="card__image"
											style={{ backgroundImage: `url(${data.image})` }}
											alt={data.name}
										/>
										<div>
											<h2>{data.name}</h2>
											<div className="card__price">${data.price}</div>
											<p className="card__info">
												{data.room_type} · {data.accommodates} guests
											</p>
										</div>
									</div>
								))}
								{renderPagination()}
							</div>
							<div className="map-container">{renderMap()}</div>
						</div>
					);
				}}
				renderItem={data => ({
					label: (
						<span style={{ width: 40, display: 'block', textAlign: 'center' }}>
							${data.price}
						</span>
					),
				})}
				react={{
					and: ['GuestSensor', 'PriceSensor', 'DateRangeSensor', 'search'],
				}}
			/>
		</ReactiveBase>
	</div>
);
