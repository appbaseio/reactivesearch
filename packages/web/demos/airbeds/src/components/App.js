import React from 'react';
import { ReactiveBase, ResultCard } from '@appbaseio/reactivesearch';

import { nav, container, rightCol } from '../styles';
import Filters from './Filters';

export default () => (
	<div className={container}>
		<ReactiveBase
			app="housing"
			credentials="0aL1X5Vts:1ee67be1-9195-4f4b-bd4f-a91cd1b5e4b5"
			type="listing"
			theme={{
				primaryColor: '#FF3A4E',
			}}
		>
			<nav className={nav}>
				Airbeds
			</nav>
			<Filters />

			<ResultCard
				className={rightCol}
				componentId="SearchResult"
				dataField="name"
				size={12}
				onData={data => ({
					image: data.image,
					title: data.name,
					description: (
						<div>
							<div className="price">${data.price}</div>
							<p className="info">{data.room_type} · {data.accommodates} guests</p>
						</div>
					),
					url: data.listing_url,
				})}
				pagination
				react={{
					and: ['GuestSensor', 'PriceSensor', 'DateRangeSensor'],
				}}
				innerClass={{
					resultStats: 'result-stats',
					list: 'list',
					listItem: 'list-item',
					image: 'image',
				}}
			/>
		</ReactiveBase>
	</div>
);
