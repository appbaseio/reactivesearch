import React from 'react';
import { Testimonial } from '@appbaseio/designkit';

export default () => (
	<Testimonial>
		<Testimonial.Card row={6} background="#66A1FF" color="#fff">
			<Testimonial.Author>
				<img
					src="https://appbase.io/static/images/customers/heitorcorrea.jpg"
					alt="Heitor Correa"
				/>
				<div>
					<h3>Heitor Correa</h3>
					<p>CTO, Hariken</p>
				</div>
			</Testimonial.Author>
			<p
				style={{
					fontSize: '1.3rem',
					lineHeight: '2rem',
				}}
			>
				Having appbase.io by our side has been like having a specialist inside the team. They are
				saving us at least 40 hours every month.
			</p>
		</Testimonial.Card>

		<Testimonial.Card row={3}>
			<Testimonial.Author>
				<img src="https://appbase.io/static/images/customers/charliewood.jpg" alt="Heitor Correa" />
				<div>
					<h3>Charlie Wood</h3>
					<p>CTO, Numerous App</p>
				</div>
			</Testimonial.Author>
			<p
				style={{
					fontSize: '1rem',
					lineHeight: '1.5rem',
				}}
			>
				Great customer support from @appbaseio, which we use for in-app search.
			</p>
		</Testimonial.Card>

		<Testimonial.Card row={4} background="#893FF3" color="#fff">
			<Testimonial.Author>
				<img src="https://appbase.io/static/images/customers/kishanpatel.jpg" alt="Heitor Correa" />
				<div>
					<h3>Kishan Patel</h3>
					<p>CTO, Lyearn</p>
				</div>
			</Testimonial.Author>
			<p
				style={{
					fontSize: '1.2rem',
					lineHeight: '1.8rem',
				}}
			>
				We use Reactivesearch for powering our search at Lyearn. It has saved us at least a month of
				work.
			</p>
		</Testimonial.Card>

		<Testimonial.Card color="#fff" row={3} small background="#52D65B">
			<p
				style={{
					fontSize: '1.1rem',
					lineHeight: '1.6rem',
				}}
			>
				The time savings have been off the charts in getting our search up and running!
			</p>
			<Testimonial.Author>
				<p>Rob Whitley, Co-Founder, Salespipe</p>
			</Testimonial.Author>
		</Testimonial.Card>

		<Testimonial.Card row={2}>
			<Testimonial.Author>
				<img
					src="https://appbase.io/static/images/customers/patrickhogan.jpg"
					alt="Heitor Correa"
				/>
				<div>
					<h3>Patrick Hogan</h3>
					<p>CEO, Tenfold</p>
				</div>
			</Testimonial.Author>
			<p
				style={{
					fontSize: '1.1rem',
					lineHeight: '1.6rem',
				}}
			>
				Appbase is fast, like Usain Bolt.
			</p>
		</Testimonial.Card>
	</Testimonial>
);
