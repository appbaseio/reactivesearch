import React, { Component } from 'react';
import { ThemeProvider } from 'emotion-theming';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Navbar, Logo, Button, H1, Title, Grid } from '@appbaseio/designkit';

import {
	Base,
	Layout,
	SecondaryLink,
	Section,
	titleText,
	showMobileFlex,
} from '../styles';
import Footer from '../components/Footer';
import ImageCard from '../styles/ImageCard';


class Demo extends Component {
	componentDidMount() {
		window.scrollTo(0, 0);
	}

	render() {
		const { config, theme } = this.props;
		const { primary } = theme;
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
										l.href === '/demo' || l.href === '/native/demo' ? 'active' : undefined
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
									<img src="images/support.svg" style={{ marginRight: 8 }} alt="support" /> SUPPORT
								</Button>
							</li>
						</Navbar.List>
					</Navbar>

					<Section>
						<Layout style={{ marginTop: '50px' }}>
							<H1>{config.title}</H1>
							<p className={titleText}>{config.description}</p>
							<Grid
								size={config.demos.length / 2}
								mdSize={2}
								smSize={1}
								gutter="15px"
								smGutter="0px"
								style={{ margin: '50px 0px' }}
							>
								{config.demos.map((d, index) => (
									// eslint-disable-next-line
									<ImageCard key={index} src={d.src}>
										<div>
											<Title>{d.title}</Title>
											<p>{d.description}</p>
										</div>
										<div>
											<SecondaryLink
												primary
												href={d.href}
												style={{
													color: primary,
												}}
											>
												Check Demo
											</SecondaryLink>
										</div>
									</ImageCard>
								))}
							</Grid>
						</Layout>
					</Section>
					<Footer />
				</Base>
			</ThemeProvider>
		);
	}
}

Demo.propTypes = {
	config: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
};
export default Demo;
