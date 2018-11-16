import React from 'react';
import { BannerRow, H2, Button } from '@appbaseio/designkit';
import PropTypes from 'prop-types';
import { css } from 'react-emotion';
import { SecondaryLink } from '../styles';

const style = css`
	p {
		color: #ffffff;
		font-weight: 300;
	}
`;
const button = {
	fontSize: '14px',
	lineHeight: '19px',
	fontWeight: 'bold',
};
const Banner = ({ config, theme, configName }) => (
	<BannerRow>
		{config.map((b, i) => (
			<BannerRow.Column
				key={
					// eslint-disable-next-line
					i
				}
				className={style}
				style={{
					backgroundColor: b.backgroundColor,
				}}
			>
				<div>
					<H2 light>{b.title}</H2>
					<p>{b.description}</p>
					<div className="button-row center">
						<Button
							href={b.button.href}
							uppercase
							big
							primary={configName !== 'vue'}
							bold
							style={{
								backgroundColor: theme.secondary,
								...button,
							}}
						>
							{b.button.title}
						</Button>
						<SecondaryLink href={b.link.href}>{b.link.title}</SecondaryLink>
					</div>
				</div>
			</BannerRow.Column>
		))}
	</BannerRow>
);
Banner.defaultProps = {
	configName: 'web',
};
Banner.propTypes = {
	// eslint-disable-next-line
	theme: PropTypes.object,
	configName: PropTypes.string,
	config: PropTypes.arrayOf(PropTypes.shape({
			backgroundColor: PropTypes.string,
			title: PropTypes.string,
			description: PropTypes.string,
			button: PropTypes.shape({
				title: PropTypes.string,
				href: PropTypes.string,
			}),
			link: PropTypes.shape({
				title: PropTypes.string,
				href: PropTypes.string,
			}),
		})).isRequired,
};
export default Banner;
