import React, { Component } from 'react';
import { css, cx } from 'react-emotion';
import { string, object } from 'prop-types';
import Number from 'react-animated-number';

import { mediaKey } from '../utils';
import H2 from '../styles/H2';
import Heading from './Heading';
import theme from '../constants/theme/web';

const BigText = Heading.withComponent('p');

const api = css({
	background: theme.primary,
	color: '#fff',
	padding: '10px 25px',
	margin: 10,
	borderRadius: 10,
	letterSpacing: '1rem',
	[mediaKey.small]: {
		fontSize: '2rem',
	},
	[mediaKey.xsmall]: {
		fontSize: '1.5rem',
	},
});

const styles = css({
	background: 'transparent',
	display: 'flex',
	alignItems: 'center',
	flexDirection: 'column',
	[mediaKey.large]: {
		flexDirection: 'column',
	},
});

const headingCls = css({
	margin: '80px auto 20px auto',
});

class DownloadStats extends Component {
	state = {
		calls: 30300,
	};

	componentDidMount() {
		this.updateApiCalls();
	}

	updateApiCalls = () => {
		// only run client side
		fetch('https://api.npmjs.org/downloads/point/last-month/@appbaseio/reactivesearch')
			.then(res => res.json())
			.then(({ downloads }) => {
				if (downloads) {
					this.setState({
						calls: downloads,
					});
				}
			})
			.catch((err) => {
				// eslint-disable-next-line
				console.error('Great Scott! An error happened while fetching monthly stats', err);
			});
	};

	render() {
		const { calls } = this.state;
		const { className, style } = this.props;
		return (
			<div css={cx(styles, className)} style={style}>
				<H2 css={headingCls}>NPM Download Stats (monthly)</H2>
				<BigText css={api}>
					<Number
						style={{
							color: '#fff',
						}}
						value={calls}
						duration={1000}
						stepPrecision={0}
					/>
				</BigText>
			</div>
		);
	}
}

DownloadStats.propTypes = {
	className: string, // eslint-disable-line
	style: object, // eslint-disable-line
};

export default DownloadStats;
