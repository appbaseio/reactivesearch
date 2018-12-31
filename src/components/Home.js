import React, { Component } from 'react';
import { Navbar, Logo, Button, H3, Title, Flex, GithubButton, Grid } from '@appbaseio/designkit';
import { HashLink as Link } from 'react-router-hash-link';
import { css } from 'emotion';
import { ThemeProvider } from 'emotion-theming';
import PropTypes from 'prop-types';
import {
	Base,
	Layout,
	banner,
	SecondaryLink,
	Row,
	Section,
	titleRow,
	vcenter,
	hideMobile,
	showMobile,
	showMobileFlex,
} from '../styles';
import ActionCard from '../styles/ActionCard';
import ImageCard from '../styles/ImageCard';
import BannerRow from './BannerRow';
import Footer from './Footer';
import Testimonials from './Testimonials';
import SupportGrid from './SupportGrid';
import { tabPadding, tabJustifyCenter } from '../styles/base';
import H1 from '../styles/H1';
import H2 from '../styles/H2';
import queries from '../styles/mediaQueries';
import { getButtonStyle, getLinkStyle } from '../styles/utils';
import DiscoverRS from './DiscoverRS';

const button = {
	fontSize: '14px',
	lineHeight: '19px',
	fontWeight: 'bold',
};
const navTitle = css`
	${queries.small`
		font-size: 20px;
	`};
`;
const description = css`
	margin-left: 7px !important;
	${queries.small`
		font-size: 12px;
	`};
`;
class HomePage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			githubStarCount: undefined,
		};
	}

	componentDidMount() {
		// To fetch reactive search github stars
		fetch('https://api.github.com/repos/appbaseio/reactivesearch')
			.then(res => res.json())
			.then((res) => {
				this.setState({
					githubStarCount: res.stargazers_count,
				});
			})
			.catch(e => console.log(e)); // eslint-disable-line

		window.scrollTo(0, 0);
	}

	render() {
		const {
			config,
			theme: { secondary, primary },
		} = this.props;
		const isVue = config.name === 'vue';
		return (
			<ThemeProvider theme={this.props.theme}>
				<Base>
					<Navbar style={{ backgroundColor: primary, color: '#fff' }} bold dark>
						<Navbar.Logo>
							<Logo css={navTitle} light href={config.header.logo.href}>
								<Logo.Icon css="color: #fff;">
									<img src={config.header.logo.src} alt="Icon" />
								</Logo.Icon>
								<Logo.Light>{config.header.logo.title.light}</Logo.Light>
								<Logo.Dark>{config.header.logo.title.dark}</Logo.Dark>
								{config.header.logo.title.description && (
									<span css={description}>
										<Logo.Light>
											{config.header.logo.title.description}
										</Logo.Light>
									</span>
								)}
							</Logo>
						</Navbar.Logo>
						<Navbar.List>
							{config.header.links.map((l, i) => (
								/* eslint-disable-next-line */
								<li key={i}>
									{/* eslint-disable-next-line */}
									<Link style={getLinkStyle(config.name)} to={l.href}>
										{l.description.toUpperCase()}
									</Link>
									{/* <a style={getLinkStyle(config.name)}
								     href={l.href}>{l.description.toUpperCase()}</a> */}
								</li>
							))}
							<li className={showMobileFlex}>
								<a href={config.urls.github}>GITHUB</a>
							</li>
							<li className="button">
								<Button
									style={{
										backgroundColor: secondary,
										...getLinkStyle(config.name),
										...getButtonStyle(config.name),
									}}
									href={config.urls.support}
									uppercase
								>
									<img
										src="images/support.svg"
										onError={(e) => {
											e.target.src = '/images/support.svg';
										}}
										style={{ marginRight: 8 }}
										alt="support"
									/>{' '}
									SUPPORT
								</Button>
							</li>
						</Navbar.List>
					</Navbar>
					<div className={banner(config.banner1.image.src, primary)}>
						<Layout>
							<div className="content">
								<H1 light>{config.banner1.title}</H1>
								<p style={getLinkStyle(config.name)}>
									{config.banner1.description}
								</p>
								<div className="button-row">
									<GithubButton
										style={button}
										count={(
											this.state.githubStarCount || config.githubCount
										).toString()}
										href={config.urls.github}
									/>
									<Button
										href={config.banner1.button.href}
										uppercase
										big
										primary={!isVue}
										style={{
											backgroundColor: secondary,
											...button,
										}}
										bold
									>
										{config.banner1.button.title}
									</Button>
									<SecondaryLink
										href={config.banner1.link.href}
										style={getLinkStyle(config.name)}
									>
										{config.banner1.link.title}
									</SecondaryLink>
								</div>
							</div>
							<div className="bg-image" />
						</Layout>
					</div>
					<Row style={{ backgroundColor: '#FEFEFE', marginTop: '50px' }}>
						<Layout>
							<div className={hideMobile}>
								<img
									src={config.banner2.image.src}
									width="100%"
									alt={config.banner2.image.alt}
								/>
							</div>
							<div style={config.banner2.style} className={vcenter}>
								<H2>{config.banner2.title}</H2>
								<img
									className={showMobile}
									src={config.banner2.image.mobile.src}
									srcSet={config.banner2.image.mobile.srcSet}
									width="100%"
									alt="Components"
									style={{ marginTop: 30 }}
								/>
								<p>{config.banner2.description}</p>
								<div className="button-row">
									<Button
										bold
										href={config.banner2.button.href}
										uppercase
										big
										primary={!isVue}
										style={{
											backgroundColor: secondary,
											...button,
										}}
									>
										{config.banner2.button.title}
									</Button>
									<SecondaryLink
										href={config.banner2.link.href}
										primary
										style={{
											color: primary,
										}}
									>
										{config.banner2.link.title}
									</SecondaryLink>
								</div>
								{config.banner2.sketch && (
									<p>
										Get{' '}
										<a href={config.banner2.sketch.href}>
											our designer templates
										</a>{' '}
										for sketch.
									</p>
								)}
							</div>
						</Layout>
					</Row>
					<Section>
						<Layout>
							<H2>{config.banner3.title}</H2>
							<p>{config.banner3.description}</p>
							<Grid
								size={Math.ceil(config.banner3.cards.length / 2)}
								mdSize={2}
								smSize={1}
								gutter="50px"
								style={{ marginTop: '60px' }}
							>
								{config.banner3.cards.map((cardI, i) => (
									// eslint-disable-next-line
									<ActionCard key={i}>
										<ActionCard.Icon>
											<img
												style={{ maxHeight: 40 }}
												src={cardI.image.src}
												alt={cardI.image.alt}
											/>
										</ActionCard.Icon>
										<Title>{cardI.title}</Title>
										<p>{cardI.description}</p>
										<SecondaryLink
											primary
											href={cardI.href}
											style={{
												color: primary,
											}}
										>
											Read More
										</SecondaryLink>
									</ActionCard>
								))}
							</Grid>
						</Layout>
					</Section>
					<BannerRow
						configName={config.name}
						config={config.banner5}
						theme={this.props.theme}
					/>
					<DiscoverRS />
					{/** Demos Section */}
					{config.banner6 && (
						<Section id="examples">
							<Layout>
								<div className={titleRow}>
									{config.banner6.button ? (
										<H3 style={{
												paddingBottom: 50,
											}}
										>
											{config.banner6.title}
										</H3>
									) : (
										<H2
											style={{
												margin: '0 auto',
												paddingBottom: 50,
											}}
										>
											{config.banner6.title}
										</H2>
									)}
									{config.banner6.button && (
										<Button
											style={{
												backgroundColor: secondary,
												...button,
											}}
											uppercase
											primary={!isVue}
											href={config.banner6.button.href}
										>
											{config.banner6.button.title}
										</Button>
									)}
								</div>
								{config.name === 'native' ? (
									<Flex
										flexDirection="column"
										justifyContent="center"
										alignItems="center"
										className={tabPadding}
									>
										<Flex
											flexDirection="row"
											justifyContent="space-around"
											alignItems="center"
											padding="3rem 0 0 0"
											style={{
												width: '95%',
											}}
											className={tabJustifyCenter}
										>
											{config.banner6.demos.map((d, index) => (
												<Flex
													// eslint-disable-next-line
													key={index}
													flexDirection="column"
													justifyContent="center"
													alignItems="center"
												>
													<a
														target="_blank"
														rel="noopener noreferrer"
														href={d.href}
														className="demo"
													>
														<img
															width="240"
															src={d.src}
															alt="Demo app"
														/>
													</a>
													<Button
														rel="noopener noreferrer"
														shadow
														primary
														style={{
															width: 140,
															marginTop: 0,
															marginBottom: 50,
															backgroundColor: secondary,
															...button,
														}}
														href={d.href}
													>
														CHECK DEMO
													</Button>
												</Flex>
											))}
										</Flex>
									</Flex>
								) : (
									<Grid
										size={4}
										mdSize={2}
										smSize={1}
										gutter="15px"
										smGutter="0px"
										style={{ marginBottom: '50px' }}
									>
										{config.banner6.demos.map((
											d,
											index, // eslint-disable-line
										) => (Object.keys(d).length ? ( // eslint-disable-next-line
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
											) : (
												<div />
											)))}
									</Grid>
								)}
							</Layout>
						</Section>
					)}
					{/** Article section */}
					{config.banner7 && (
						<Section
							style={{
								padding: '10px 0',
							}}
							id="articles"
						>
							<Layout>
								<div className={titleRow}>
									{config.banner7.button ? (
										<H3 style={{
											paddingBottom: 50,
											}}
										>
											{config.banner7.title}
										</H3>
									) : (
										<H2
											style={{
												margin: '0 auto',
												paddingBottom: 50,
											}}
										>
											{config.banner7.title}
										</H2>
									)}
									{config.banner7.button && (
										<Button
											style={{
												backgroundColor: secondary,
												...button,
											}}
											uppercase
											primary={!isVue}
											href={config.banner7.button.href}
										>
											{config.banner7.button.title}
										</Button>
									)}
								</div>
								<Grid
									size={4}
									mdSize={2}
									smSize={1}
									gutter="15px"
									smGutter="0px"
									style={{ marginBottom: '50px' }}
								>
									{config.banner7.articles.map((d, index) => (
										Object.keys(d).length ? (
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
														Read Now
													</SecondaryLink>
												</div>
										</ImageCard>)
										: <div />
									))}
								</Grid>
							</Layout>
						</Section>
					)}
					<Section style={{ backgroundColor: '#fff' }}>
						<Layout>
							<H2>See what our users say</H2>
							<Testimonials />
						</Layout>
					</Section>
					<Section>
						<Layout>
							<H2>Get started in minutes</H2>
							<Button
								href={config.gettingStart}
								uppercase
								big
								primary={!isVue}
								style={{
									backgroundColor: secondary,
									margin: '25px 0 30px',
									...button,
								}}
							>
								BUILD MY FIRST APP
							</Button>

							<H2>Need Help?</H2>
							<p>Resources to get help with Reactive Search.</p>

							<SupportGrid configName={config.name} />
						</Layout>
					</Section>
					<Footer configName={config.name} footerConfig={config.footer} />
					<a
						href={config.producthunt}
						// eslint-disable-next-line
						target="_blank"
						className="featured-post-link"
					>
						<span>Featured on Producthunt</span>🎉
					</a>
				</Base>
			</ThemeProvider>
		);
	}
}
HomePage.propTypes = {
	config: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
};
export default HomePage;
