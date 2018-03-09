import React from 'react';
import { ReactiveBase, DataSearch } from '@appbaseio/reactivesearch';
import { ReactiveMap } from '@appbaseio/reactivemaps';

import { nav, container, search, title } from '../styles';
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
				componentId="map"
				dataField="location"
				defaultZoom={13}
				pagination
				showSearchAsMove
				style={{
				// 	width: '400px',
					height: 'calc(100vh - 52px)',
				// 	position: 'fixed',
				// 	top: '52px',
				// 	right: 0,
				// 	zIndex: 200,
				}}
				onAllData={(hits, streamHits, loadMore, renderMap, renderPagination) => (
					<div style={{
						width: 'calc(100% - 320px)',
						position: 'absolute',
						right: 0,
						display: 'flex',
					}}
					>
						<div style={{ width: '50%' }}>
							{hits.map(item => (<div key={item._id}>{item.price}</div>))}
							{renderPagination()}
						</div>
						<div style={{ width: '50%' }}>
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
