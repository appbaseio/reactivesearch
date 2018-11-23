import React from 'react';
import { Footer, Title, Flex } from '@appbaseio/designkit';
import { string, arrayOf, bool, shape } from 'prop-types';
import { css } from 'react-emotion';
import { mediaKey } from '../utils';

const getTitleStyle = (configName) => {
	if (configName === 'vue') {
		return {
			opacity: 0.5,
			color: '#ffffff',
		};
	}
	return {};
};
const getLinkStyle = (configName) => {
	if (configName === 'vue') {
		return {
			color: '#ffffff',
		};
	}
	return {};
};
const getInfoStyle = (configName) => {
	const infoCls = {
		color: '#fff',
		fontSize: 13,
		fontWeight: 600,
	};
	if (configName !== 'vue') {
		infoCls.opacity = 0.45;
	}
	return infoCls;
};

const titleStyle = {
	margin: '0.9rem 0px',
};

const mask = css`
	height: 20px;
	width: 20px;
	border-radius: 3px;
	background-color: rgba(255, 255, 255, 0.1);
	margin: 20px 10px 0 0;
`;

const FooterBrand = ({ configName }) => (
	<React.Fragment>
		<img
			width="100%"
			src="https://opensource.appbase.io/reactivesearch/images/logo.svg"
			alt="appbase.io"
		/>
		<div
			className={css({
				textAlign: 'left',
				marginTop: '10px',
				[mediaKey.large]: {
					textAlign: 'center',
					marginTop: '0',
				},
			})}
		>
			<a
				target="_blank"
				rel="noopener noreferrer"
				href="mailto:info@appbase.io"
				style={getInfoStyle(configName)}
			>
				info@appbase.io
			</a>
		</div>

		<Flex
			alignItems="center"
			className={css({
				[mediaKey.large]: {
					justifyContent: 'center',
				},
			})}
		>
			<a target="_blank" rel="noopener noreferrer" href="https://github.com/appbaseio/">
				<div className={mask}>
					<img
						alt="Github"
						srcSet="images/footer/Github@3x.svg 3x, images/footer/Github@2x.png 2x, images/footer/Github@1x.png"
					/>
				</div>
			</a>
			<a target="_blank" rel="noopener noreferrer" href="https://medium.appbase.io/">
				<div className={mask}>
					<img
						alt="Medium"
						srcSet="images/footer/Medium@3x.svg 3x, images/footer/Medium@2x.png 2x, images/footer/Medium@1x.png"
					/>
				</div>
			</a>
			<a target="_blank" rel="noopener noreferrer" href="https://twitter.com/appbaseio">
				<div className={mask}>
					<img
						alt="Twitter"
						srcSet="images/footer/Twitter%20Copy@3x.svg 3x, images/footer/Twitter%20Copy@2x.png 2x, images/footer/Twitter%20Copy@1x.png"
					/>
				</div>
			</a>
		</Flex>
	</React.Fragment>
);
FooterBrand.propTypes = {
	configName: string.isRequired,
};

const AppFooter = ({ configName, footerConfig }) => (
	<div css="background-color: rgb(6, 32, 51)">
		<Footer
			className={css({
				padding: '60px 0',
				[mediaKey.medium]: {
					paddingBottom: '0',
				},
			})}
		>
			<Footer.Brand
				className={css({
					[mediaKey.large]: {
						display: 'none',
					},
				})}
			>
				<FooterBrand configName={configName} />
			</Footer.Brand>
			<Footer.Links
				className={css({
					[mediaKey.large]: {
						width: '100%',
					},
				})}
			>
				{footerConfig.map(footerList => (
					<Footer.List key={footerList.title}>
						<Title style={{ ...titleStyle, ...getTitleStyle(configName) }} className="heading">
							{footerList.title}
						</Title>
						{footerList.list.map((list, index) => (
							// eslint-disable-next-line
							<li key={index}>
								<a
									style={getLinkStyle(configName)}
									{...(list.openWithTab
										? {
												target: '_blank',
												rel: 'noopener noreferrer',
										  }
										: {})}
									href={list.href}
								>
									{list.title}
								</a>
							</li>
						))}
					</Footer.List>
				))}
			</Footer.Links>
		</Footer>
		<div
			className={css({
				width: 200,
				margin: '0 auto',
				paddingBottom: 50,
				display: 'none',
				[mediaKey.large]: {
					display: 'block',
				},
			})}
		>
			<FooterBrand configName={configName} />
		</div>
	</div>
);

AppFooter.defaultProps = {
	footerConfig: [],
};

AppFooter.propTypes = {
	configName: string.isRequired,
	footerConfig: arrayOf(shape({
			title: string,
			list: arrayOf(shape({
					title: string,
					href: string,
					openWithTab: bool,
				})),
		})),
};

export default AppFooter;
