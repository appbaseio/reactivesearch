import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import { Grid as FlexGrid, Card, Flex } from '@appbaseio/designkit';
import { mediaKey, media } from '../utils';
import { Section } from '../styles';
import H2 from '../styles/H2';

const cardCls = css`
	max-width: 450px;
	padding: 17px 33px !important;
	text-align: left;
	box-shadow: 1px 2px 5px 0 rgba(0, 0, 0, 0.05) !important;
	&:hover {
		box-shadow: 2px 3px 6px 1px rgba(0, 0, 0, 0.05) !important;
	}
`;
const imgCls = css`
	height: 76px !important;
	width: 76px !important;
`;
const titleCls = css`
	font-size: 24px;
	font-weight: 600;
	line-height: 30px;
	margin-left: 13px;
	${media.large(css`
		font-size: 16px;
	`)};
`;

const DiscoverRS = ({ cardConfig }) => (
	<Section css="max-width: 950px;margin: 0 auto;background-color: #fff">
		<H2 css="margin-bottom: 20px;"> Other Reactive&lt;X&gt; libraries</H2>{' '}
		<p css="max-width: 700px;margin: 0 auto 64px auto">
			Build consistent, cross-platform search UIs that delight your users.
		</p>
		<FlexGrid
			size={2}
			mdSize={2}
			gutter="20px"
			smSize={1}
			style={{ marginTop: '38px' }}
			css={{
				[mediaKey.medium]: {
					justifyContent: 'center',
				},
			}}
		>
			{cardConfig.map((card, index) => (
				<Card
					target="_blank"
					href={card.href}
					// eslint-disable-next-line
					key={index}
					className={cardCls}
				>
					<Flex>
						<div>
							<img className={imgCls} srcSet={card.srcSet} alt={card.title} />
						</div>

						<Flex justifyContent="center" alignItems="center">
							<h4 css={titleCls}>{card.title}</h4>
						</Flex>
					</Flex>
				</Card>
			))}
		</FlexGrid>
	</Section>
);

DiscoverRS.propTypes = {
	cardConfig: PropTypes.arrayOf(PropTypes.shape({
			title: PropTypes.string,
			srcSet: PropTypes.string,
			href: PropTypes.string,
		})),
};

DiscoverRS.defaultProps = {
	cardConfig: [
		{
			title: 'ReactiveSearch',
			srcSet:
				'images/reactivesearch/Reactive%20Search@3x.svg 3x, images/reactivesearch/Reactive%20Search@2x.png 2x, images/reactivesearch/Reactive%20Search@1x.png',
			href: '../../reactivesearch/',
		},
		{
			title: 'ReactiveSearch for Vue',
			srcSet:
				'images/reactivesearch/Reactive%20Search%20for%20vue@3x.svg 3x, images/reactivesearch/Reactive%20Search%20for%20vue@2x.png 2x, images/reactivesearch/Reactive%20Search%20for%20vue@1x.png',
			href: '../../reactivesearch/vue',
		},
		{
			title: 'ReactiveSearch Native',
			srcSet:
				'images/reactivesearch/Reactive%20Search%20Native@3x.svg 3x, images/reactivesearch/Reactive%20Search%20Native@2x.png 2x, images/reactivesearch/Reactive%20Search%20Native@1x.png',
			href: '../../reactivesearch/native',
		},
		{
			title: 'Reactive Maps',
			srcSet:
				'images/reactivesearch/Group%2029@3x.svg 3x, images/reactivesearch/Group%2029@2x.png 2x, images/reactivesearch/Group%2029@1x.png',
			href: 'https://opensource.appbase.io/reactivemaps/',
		},
	],
};

export default DiscoverRS;
