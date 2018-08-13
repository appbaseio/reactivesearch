import React from 'react';
import { BannerRow, H2, Button } from '@appbaseio/designkit';
import PropTypes from 'prop-types';
import { secondary } from './../constants';
import { SecondaryLink } from '../styles';

const Banner = ({ config }) => (
	<BannerRow >
		{config.map((
			b,
			i,
		) => (
			<BannerRow.Column
				key={
					// eslint-disable-next-line
						i
				}
				style={{
					backgroundColor:
							b.backgroundColor,
				}}
			>
				<div >
					<H2
						light
					>
						{
							b.title
						}
					</H2>
					<p >
						{
							b.description
						}
					</p>
					<div className="button-row center">
						<Button
							href={
								b
									.button
									.href
							}
							bold
							uppercase
							big
							primary
							style={{
								backgroundColor: secondary,
							}}
						>
							{
								b
									.button
									.title
							}
						</Button>
						<SecondaryLink
							href={
								b
									.link
									.href
							}
						>
							{
								b
									.link
									.title
							}
						</SecondaryLink>
					</div>
				</div>
			</BannerRow.Column>
		))}
	</BannerRow>
);

Banner.propTypes = {
	config: PropTypes.arrayOf(PropTypes.shape({
		backgroundColor:
					PropTypes.string,
		title:
					PropTypes.string,
		description:
					PropTypes.string,
		button: PropTypes.shape({
			title:
							PropTypes.string,
			href:
							PropTypes.string,
		}),
		link: PropTypes.shape({
			title:
							PropTypes.string,
			href:
							PropTypes.string,
		}),
	})),
};
export default Banner;
