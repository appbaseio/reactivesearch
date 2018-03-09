import React from 'react';
import { ReactiveBase, DataSearch } from '@appbaseio/reactivesearch';
import { ReactiveMap } from '@appbaseio/reactivemaps';

import { nav, container, rightCol, search, title } from '../styles';
import Filters from './Filters';

export default () => (
	<div className={container}>
		<ReactiveBase
			app="housing"
			credentials="0aL1X5Vts:1ee67be1-9195-4f4b-bd4f-a91cd1b5e4b5"
			type="listing"
			theme={{
				colors: {
					primaryColor: '#FF3A4E',
				},
			}}
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

			<ReactiveMap
				className={rightCol}
				componentId="map"
				dataField="location"
				defaultZoom={13}
				onAllData={(hits, streamHits, loadMore, renderMap, renderPagination) => (
					<div style={{ display: 'flex' }}>
						<div style={{ width: '100%' }}>
							{hits && hits.map(data => (
								<div key={data._id} className="card">
									<img src={data._source.image} alt={data._source.name} />
									<div>
										<h2>{data._source.name}</h2>
										<div className="price">${data._source.price}</div>
										<p className="info">{data._source.room_type} · {data._source.accommodates} guests</p>
									</div>
								</div>
							))}
							{renderPagination()}
						</div>
						<div style={{ width: '800px' }}>
							{renderMap()}
						</div>
					</div>
				)}
				onData={data => ({
					label: <span style={{ width: 40, display: 'block', textAlign: 'center' }}>${data.price}</span>,
				})}
				react={{
					and: ['GuestSensor', 'PriceSensor', 'DateRangeSensor', 'search'],
				}}
			/>
		</ReactiveBase>
	</div>
);
