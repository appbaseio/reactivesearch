import React, { Component } from 'react';
import { ThemeProvider } from 'emotion-theming';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Navbar, Logo, Button, H1, H2, Title, Grid } from '@appbaseio/designkit';

import {
	Base,
	Layout,
	SecondaryLink,
	Section,
	titleText,
	stepCard,
	showMobileFlex,
} from '../styles';
import SupportGrid from '../components/SupportGrid';
import BannerRow from '../components/BannerRow';
import Footer from '../components/Footer';

const title = {
	marginTop: '10px',
};
class Learn extends Component {
	componentDidMount() {
		window.scrollTo(0, 0);
	}

	render() {
		const { config, theme } = this.props;
		return (
			<ThemeProvider
				theme={{
					primaryColor: '#0033FF',
				}}
			>
				<Base>
					<Navbar bold>
						<Navbar.Logo>
							<Logo href={config.header.logo.href}>
								<Logo.Icon css="color: #fff;">
									<img src={config.header.logo.src} alt="Icon" />
								</Logo.Icon>
								<Logo.Light>{config.header.logo.title.light}</Logo.Light>
								<Logo.Dark>{config.header.logo.title.dark}</Logo.Dark>
							</Logo>
						</Navbar.Logo>
						<Navbar.List>
							{config.header.links.map((l, i) => (
								<li
									className={
										l.href === '/learn' || l.href === '/native/learn' ? 'active' : undefined
									}
									/* eslint-disable-next-line */
									key={i}
								>
									{/* eslint-disable-next-line */}
									<Link style={{ color: '#424242' }} to={l.href}>
										{l.description.toUpperCase()}
									</Link>
								</li>
							))}
							<li className={showMobileFlex}>
								<a href={config.urls.github}>GITHUB</a>
							</li>
							<li className="button">
								<Button
									style={{ backgroundColor: theme.secondary }}
									href={config.urls.support}
									bold
									uppercase
								>
									<img src="/images/support.svg" style={{ marginRight: 8 }} alt="support" /> SUPPORT
								</Button>
							</li>
						</Navbar.List>
					</Navbar>

					<Section>
						<Layout style={{ marginTop: '50px' }}>
							<H1>{config.title}</H1>
							<p className={titleText}>{config.description}</p>

							<Grid
								size={3}
								mdSize={2}
								smSize={1}
								gutter="12px"
								smGutter="0px"
								style={{
									marginTop: 60,
								}}
							>
								{config.installationSteps.map((step, i) => (
									// eslint-disable-next-line
									<div key={i} className={stepCard}>
										<span className="count" style={{ color: theme.primaryDark }}>
											{i + 1}
										</span>
										<div>
											<Title style={title}>{step.title}</Title>
											{/* eslint-disable-next-line */}
											{step.descriptions && step.descriptions.map((d, i) => <p key={i}>{d}</p>)}
										</div>
										{/* eslint-disable-next-line */}
										{step.codes && (
											<div className="full">
												{step.codes.map((code, index) => (
													// eslint-disable-next-line
													<pre key={index}>
														<code>{code}</code>
													</pre>
												))}
											</div>
										)}
										<div>
											{step.links &&
												step.links.map((link, index2) => (
													<SecondaryLink
														// eslint-disable-next-line
														key={index2}
														primary
														rel="noopener noreferrer"
														href={link.href}
														target="_blank"
														style={{
															color: theme.primaryDark,
															marginLeft: index2 > 0 ? '1rem' : undefined,
														}}
													>
														{link.title}
													</SecondaryLink>
												))}
										</div>
									</div>
								))}
							</Grid>
						</Layout>
					</Section>

					<BannerRow config={config.banner} theme={theme} />

					<Section>
						<Layout>
							<H2>Need Help?</H2>
							<p>Resources to get help with Reactive Search.</p>

							<SupportGrid />
						</Layout>
					</Section>

					<Footer />
				</Base>
			</ThemeProvider>
		);
	}
}

Learn.propTypes = {
	config: PropTypes.object,
	theme: PropTypes.object,
};
export default Learn;
