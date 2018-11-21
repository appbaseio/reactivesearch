import React, { Component } from 'react';
import { ThemeProvider } from 'emotion-theming';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import { Navbar, Logo, Button, H1, GithubButton, Grid } from '@appbaseio/designkit';
import {
	Base,
	Layout,
	SecondaryLink,
	brand,
	Section,
	vcenter,
	hcenter,
	hideMobile,
	hideTab,
	tabCenter,
	titleText,
	featureList,
	boldFont,
	showMobileFlex,
} from '../styles';
import queries from '../styles/mediaQueries';
import { getLinkStyle } from '../styles/utils';
import Footer from '../components/Footer';
import H2 from '../styles/H2';

const navTitle = css`
	${queries.small`
		font-size: 20px;
	`};
`;

const button = {
	fontSize: '14px',
	lineHeight: '19px',
	fontWeight: 'bold',
};
class Tools extends Component {
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
			.catch(e => console.log(e));
		window.scrollTo(0, 0);
	}

	render() {
		const {
			config,
			theme: { secondary, primaryDark, textDark },
		} = this.props;
		const isVue = config.name === 'vue';
		return (
			<ThemeProvider theme={this.props.theme}>
				<Base>
					<Navbar style={{ backgroundColor: primaryDark, color: '#fff' }} bold dark>
						<Navbar.Logo>
							<Logo css={navTitle} light href={config.header.logo.href}>
								<Logo.Icon css="color: #fff;">
									<img src={config.header.logo.src} alt="Icon" />
								</Logo.Icon>
								<Logo.Light>{config.header.logo.title.light}</Logo.Light>
								<Logo.Dark>{config.header.logo.title.dark}</Logo.Dark>
								{config.header.logo.title.description && (
									<span css="margin-left: 7px !important">
										<Logo.Light>{config.header.logo.title.description}</Logo.Light>
									</span>
								)}
							</Logo>
						</Navbar.Logo>
						<Navbar.List>
							{config.header.links.map((l, i) => (
								<li
									className={l.href.endsWith('/tools') ? 'active' : undefined}
									/* eslint-disable-next-line */
									key={i}
								>
									{/* eslint-disable-next-line */}
									<Link style={getLinkStyle(config.name)} to={l.href}>
										{l.description.toUpperCase()}
									</Link>
								</li>
							))}
							<li className={showMobileFlex}>
								<a href={config.urls.github}>GITHUB</a>
							</li>
							<li className="button">
								<Button
									style={{
										backgroundColor: secondary,
										...button,
										color: isVue ? textDark : undefined,
									}}
									href={config.urls.support}
									bold
									uppercase
								>
									<img
										src={isVue ? 'images/supportDark.svg' : 'images/support.svg'}
										style={{ marginRight: 8 }}
										alt="support"
									/>{' '}
									SUPPORT
								</Button>
							</li>
						</Navbar.List>
					</Navbar>
					<Section
						style={{
							backgroundColor: config.banner1.backgroundColor,
						}}
					>
						<Layout>
							<H1 light>
								Reactive <span className={boldFont}>X</span>
							</H1>
							<p
								style={{
									color: '#F5F8FF',
									marginBottom: 40,
								}}
								className={titleText}
							>
								All of our companion Reactive UI component kits.
							</p>

							<GithubButton
								count={(this.state.githubStarCount || config.githubCount || '').toString()}
								href={config.urls.github}
							/>

							<Grid
								size={4}
								smSize={1}
								gutter="30px"
								smGutter="30px"
								style={{
									marginTop: 72,
								}}
								className={hideMobile}
							>
								<div>
									<img src="images/tools/Search.svg" alt="Reactivesearch for web" />
									<p className={brand}>
										Reactive <span className={boldFont}>Search</span> for web
									</p>
								</div>
								<div>
									<img src="images/tools/ReactiveMaps.svg" alt="Reactivemaps" />
									<p className={brand}>
										Reactive <span className={boldFont}>Maps</span> for web
									</p>
								</div>
								<div>
									<img src="images/tools/Vue.svg" alt="Reactivesearch for vue" />
									<p className={brand}>
										Reactive <span className={boldFont}>Search</span> for vue
									</p>
								</div>
								<div>
									<img src="images/tools/ReactiveNative.svg" alt="Reactivesearch for mobile" />
									<p className={brand}>
										Reactive <span className={boldFont}>Search</span> for mobile
									</p>
								</div>
							</Grid>
						</Layout>
					</Section>

					<Section
						style={{
							backgroundColor: config.banner2.backgroundColor,
							overflow: 'hidden',
						}}
					>
						<Layout>
							<Grid size={2} mdSize={1} gutter="30px" smGutter="0px" className={tabCenter}>
								<div
									className={vcenter}
									style={{
										margin: 0,
										padding: '0 20px',
									}}
								>
									<H2 light>
										<img
											src="images/tools/Search.svg"
											alt="Reactivesearch for web"
											style={{
												height: '44px',
												marginRight: '15px',
												top: '2px',
												position: 'relative',
											}}
										/>
										Reactive <span className={boldFont}>Search</span>
									</H2>
									<p style={{ color: '#fff' }}>
										An Elasticsearch components library for building search UIs.
									</p>

									<ul className={featureList}>
										<li>20+ pre-built React UI components with configurable styles and queries.</li>
										<li>Bring your own UI components.</li>
										<li>Used in production for B2B, e-commerce, and SaaS search.</li>
									</ul>

									<div className="button-row">
										<Button
											href="https://opensource.appbase.io/reactive-manual/getting-started/reactivesearch.html"
											target="_blank"
											rel="noopener noreferrer"
											bold
											uppercase
											big
											primary={!isVue}
											style={{
												backgroundColor: secondary,
												...button,
											}}
										>
											Get Started
										</Button>
										<SecondaryLink
											href="https://github.com/appbaseio/reactivesearch/tree/dev/packages/web"
											target="_blank"
											rel="noopener noreferrer"
											primary
											style={{
												color: '#fff',
											}}
										>
											Learn More
										</SecondaryLink>
									</div>
								</div>
								<div
									style={{
										margin: 0,
									}}
									className={hideTab}
								>
									<img
										src="images/tools/Devices.png"
										srcSet="images/tools/Devices@2x.png 2x"
										alt="Reactivesearch"
									/>
								</div>
							</Grid>
						</Layout>
					</Section>

					<Section
						style={{
							backgroundColor: config.banner3.backgroundColor,
						}}
					>
						<Layout>
							<Grid size={2} mdSize={1} gutter="30px" smGutter="0px" className={tabCenter}>
								<div
									style={{
										margin: 0,
									}}
									className={hideTab}
								>
									<img width="100%" src="images/tools/ReactiveMaps.png" alt="Reactivemaps" />
								</div>
								<div
									className={vcenter}
									style={{
										margin: 0,
										padding: '0 20px',
									}}
								>
									<H2 light>
										<img
											src="images/tools/ReactiveMaps.svg"
											alt="Reactivesearch for web"
											style={{
												height: '44px',
												marginRight: '15px',
												top: '2px',
												position: 'relative',
											}}
										/>
										Reactive <span className={boldFont}>Maps</span>
									</H2>
									<p
										style={{
											color: '#fff',
										}}
									>
										An Elasticsearch components library for building geolocation apps.
									</p>

									<ul className={featureList}>
										<li
											style={{
												color: '#fff',
											}}
										>
											Works with ReactiveSearch components, and adds geospatial components for Maps.
										</li>
										<li
											style={{
												color: '#fff',
											}}
										>
											Bring your own UI components.
										</li>
										<li
											style={{
												color: '#fff',
											}}
										>
											Built on top of Google Maps. It can be extended to build routes, places and
											location streaming apps.
										</li>
									</ul>

									<div className="button-row">
										<Button
											href="https://opensource.appbase.io/reactive-manual/getting-started/reactivemaps.html"
											target="_blank"
											rel="noopener noreferrer"
											bold
											uppercase
											big
											primary={!isVue}
											style={{
												backgroundColor: secondary,
												...button,
											}}
										>
											Get Started
										</Button>
										<SecondaryLink
											href="https://github.com/appbaseio/reactivesearch/tree/dev/packages/maps"
											target="_blank"
											rel="noopener noreferrer"
										>
											Learn More
										</SecondaryLink>
									</div>
								</div>
							</Grid>
						</Layout>
					</Section>

					<Section
						style={{
							backgroundColor: config.bannerVue.backgroundColor,
							overflow: 'hidden',
						}}
					>
						<Layout>
							<Grid size={2} mdSize={1} gutter="30px" smGutter="0px" className={tabCenter}>
								<div
									className={vcenter}
									style={{
										margin: 0,
										padding: '0 20px',
									}}
								>
									<H2 light>
										<img
											src="images/tools/vueSmall.svg"
											alt="Reactivesearch for vue"
											style={{
												height: '44px',
												marginRight: '15px',
												top: '2px',
												position: 'relative',
											}}
										/>
										Reactive Search for <span className={boldFont}>vue</span>
									</H2>
									<p style={{ color: '#fff' }}>
										An Elasticsearch components library for building search UIs in vue.
									</p>

									<ul className={featureList}>
										<li>
											Over 10 pre-built UI components that maintain design parity with web
											components.
										</li>
										<li>Bring your own UI components.</li>
										<li>Currently in preview. Hit us at Gitter or Github for issues.</li>
									</ul>

									<div className="button-row">
										<Button
											href="https://opensource.appbase.io/reactive-manual/vue/getting-started/reactivesearch.html"
											target="_blank"
											rel="noopener noreferrer"
											bold
											uppercase
											big
											primary={!isVue}
											style={{
												backgroundColor: secondary,
												...button,
											}}
										>
											Get Started
										</Button>
										<SecondaryLink
											href="https://github.com/appbaseio/reactivesearch/tree/dev/packages/vue"
											target="_blank"
											rel="noopener noreferrer"
											primary
											style={{
												color: '#fff',
											}}
										>
											Learn More
										</SecondaryLink>
									</div>
								</div>
								<div
									style={{
										margin: 0,
									}}
									className={hideTab}
								>
									<img width="100%" src="images/tools/VueComponent.png" alt="Reactivesearch" />
								</div>
							</Grid>
						</Layout>
					</Section>

					<Section
						style={{
							backgroundColor: config.banner4.backgroundColor,
						}}
					>
						<Layout>
							<Grid size={2} mdSize={1} gutter="30px" smGutter="0px" className={tabCenter}>
								<div
									style={{
										margin: 0,
									}}
									className={hideTab}
								>
									<img
										width="100%"
										src="images/tools/Native.png"
										srcSet="images/tools/Native@2x.png 2x"
										alt="Reactivesearch Native"
									/>
								</div>
								<div
									className={vcenter}
									style={{
										margin: 0,
										padding: '0 20px',
									}}
								>
									<H2 light>
										<img
											src="images/tools/ReactiveNative.svg"
											alt="Reactivesearch for web"
											style={{
												height: '44px',
												marginRight: '15px',
												top: '2px',
												position: 'relative',
											}}
										/>
										Reactive
										<span className={boldFont}>Search Native</span>
									</H2>
									<p style={{ color: '#fff' }}>
										Elasticsearch UI components for React Native targeting Android and iOS apps.
									</p>

									<ul className={featureList}>
										<li>
											Over 10 pre-built UI components that maintain design parity with web
											components.
										</li>
										<li>Bring your own UI components.</li>
										<li>
											Currently in preview. Hit us at{' '}
											<a
												href="https://gitter.com/appbaseio/reactivesearch"
												rel="noopener noreferrer"
												target="_blank"
											>
												Gitter
											</a>{' '}
											or{' '}
											<a
												href="https://github.com/appbaseio/reactivesearch"
												rel="noopener noreferrer"
												target="_blank"
											>
												Github
											</a>{' '}
											for issues.
										</li>
									</ul>

									<div className="button-row">
										<Button
											href="https://hackernoon.com/building-an-e-commerce-search-app-with-react-native-2c87760a2315"
											target="_blank"
											rel="noopener noreferrer"
											bold
											uppercase
											big
											primary={!isVue}
											style={{
												backgroundColor: secondary,
												...button,
											}}
										>
											Get Started
										</Button>
										<SecondaryLink
											href="https://github.com/appbaseio/reactivesearch/tree/dev/packages/native"
											target="_blank"
											rel="noopener noreferrer"
											primary
											style={{
												color: '#fff',
											}}
										>
											Learn More
										</SecondaryLink>
									</div>
								</div>
							</Grid>
						</Layout>
					</Section>

					<Section
						style={{
							backgroundColor: config.banner5.backgroundColor,
						}}
					>
						<Layout>
							<H2>Build better reactive apps with appbase.io</H2>
							<img
								style={{
									margin: '60px auto 0',
									width: '80%',
								}}
								src="images/tools/ToolsIllustration.png"
								srcSet="images/tools/ToolsIllustration@2x.png 2x"
								alt="appbase.io"
							/>
							<H2>Work with us to build your app</H2>
							<div className={hcenter}>
								<p
									style={{
										maxWidth: 450,
										margin: '20px auto 40px',
									}}
								>
									We offer production support for ReactiveMaps. Work with us to bring your dream
									project to life.
								</p>
								<div className="button-row">
									<Button
										href="https://appbase.io/"
										bold
										uppercase
										big
										dark
										style={{
											backgroundColor: secondary,
											color: isVue ? textDark : undefined,
											...button,
										}}
									>
										Host with appbase.io
									</Button>
									<Button
										href="https://appbase.io/support"
										bold
										uppercase
										big
										dark
										style={{
											backgroundColor: secondary,
											color: isVue ? textDark : undefined,
											...button,
										}}
									>
										<img
											src={isVue ? 'images/supportDark.svg' : 'images/support.svg'}
											style={{
												marginRight: 10,
											}}
											alt="support"
										/>
										SUPPORT PLANS
									</Button>
								</div>
							</div>
						</Layout>
					</Section>

					<Footer configName={config.name} footerConfig={config.footer} />
				</Base>
			</ThemeProvider>
		);
	}
}
Tools.propTypes = {
	// eslint-disable-next-line
	config: PropTypes.object,
	// eslint-disable-next-line
	theme: PropTypes.object,
};
export default Tools;
