import React, { Component } from 'react';
import {
	Navbar,
	Logo,
	Button,
	H1,
	H2,
	H3,
	Title,
	Flex,
	Text,
	GithubButton,
	Grid,
} from '@appbaseio/designkit';
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
import BannerRow from '../components/BannerRow';
import Footer from '../components/Footer';
import Testimonials from '../components/Testimonials';
import SupportGrid from '../components/SupportGrid';
import { code } from '../styles/base';
import { mockDataSearch, mockDataSearchFull } from '../components/mock';

function isScrolledIntoView(el) {
	const rect = el.getBoundingClientRect();
	const Ti = rect.top;
	const elemBottom = rect.bottom;

	const isVisible = Ti <= window.innerHeight / 2 && elemBottom >= 0;
	return { isVisible, Ti };
}
const button = {
	fontSize: '14px',
	lineHeight: '19px',
	fontWeight: 'bold',
};
class HomePage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			origin: 0,
			githubStarCount: undefined,
		};
	}

	componentDidMount() {
		const el = document.getElementById('code');
		// To fetch reactive search github stars
		fetch('https://api.github.com/repos/appbaseio/reactivesearch')
			.then(res => res.json())
			.then((res) => {
				this.setState({
					githubStarCount: res.stargazers_count,
				});
			})
			.catch(e => console.log(e));

		window.addEventListener('scroll', () => {
			const { isVisible, Ti } = isScrolledIntoView(el);

			const L = 1850;
			const K = 500;
			const Tc = window.innerHeight / 2;
			const delta = Tc - Ti;
			const scroll = Math.min((delta * L) / K, L - K);

			if (isVisible) {
				this.setState({
					origin: scroll * -1,
				});
			} else if (Tc < Ti) {
				this.setState({
					origin: 0,
				});
			}
		});

		window.scrollTo(0, 0);
	}

	render() {
		const {
			config,
			theme: { secondary, primary },
		} = this.props;
		return (
			<ThemeProvider theme={this.props.theme}>
				<Base>
					<Navbar style={{ backgroundColor: primary, color: '#fff' }} bold dark>
						<Navbar.Logo>
							<Logo light href={config.header.logo.href}>
								<Logo.Icon css="color: #fff;">
									<img src={config.header.logo.src} alt="Icon" />
								</Logo.Icon>
								<Logo.Light>{config.header.logo.title.light}</Logo.Light>
								<Logo.Dark>{config.header.logo.title.dark}</Logo.Dark>
							</Logo>
						</Navbar.Logo>
						<Navbar.List>
							{config.header.links.map((l, i) => (
								/* eslint-disable-next-line */
								<li key={i}>
									{/* eslint-disable-next-line */}
									<a href={l.href}>{l.description.toUpperCase()}</a>
								</li>
							))}
							<li className={showMobileFlex}>
								<a href={config.urls.github}>GITHUB</a>
							</li>
							<li className="button">
								<Button style={{ backgroundColor: secondary }} href={config.urls.support} uppercase>
									<img src="images/support.svg" style={{ marginRight: 8 }} alt="support" /> SUPPORT
								</Button>
							</li>
						</Navbar.List>
					</Navbar>
					<div className={banner(config.banner1.image.src, primary)}>
						<Layout>
							<div className="content">
								<H1 light>{config.banner1.title}</H1>
								<p>{config.banner1.description}</p>
								<div className="button-row">
									<GithubButton
										style={button}
										count={(this.state.githubStarCount || config.githubCount).toString()}
										href={config.urls.github}
									/>
									<Button
										href={config.banner1.button.href}
										uppercase
										big
										primary
										style={{
											backgroundColor: secondary,
											...button,
										}}
										bold
									>
										{config.banner1.button.title}
									</Button>
									<SecondaryLink href={config.banner1.link.href}>
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
								<img src={config.banner2.image.src} width="100%" alt={config.banner2.image.alt} />
							</div>
							<div className={vcenter}>
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
										primary
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
								<p>
									Get <a href={config.banner2.sketch.href}>our designer templates</a> for sketch.
								</p>
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
											<img src={cardI.image.src} alt={cardI.image.alt} />
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
					<Flex
						padding="3rem 3rem 1rem"
						flexDirection="column"
						justifyContent="center"
						alignItems="center"
						className={hideMobile}
					>
						<H2>{config.banner4.title}</H2>
						<Text
							fontSize="1rem"
							lineHeight="1.5rem"
							style={{ maxWidth: '600px', textAlign: 'center' }}
						>
							{config.banner4.description}
						</Text>

						<Flex padding="0 30px" justifyContent="center" margin="30px 0 0">
							<Flex id="code" className={code}>
								<div
									style={{
										transform: `translateY(${this.state.origin}px)`,
										transition: 'all .3s ease-out',
										willChange: 'transform',
									}}
									dangerouslySetInnerHTML={{ __html: mockDataSearchFull }}
								/>
							</Flex>
							<Flex className={code}>
								<div dangerouslySetInnerHTML={{ __html: mockDataSearch }} />
							</Flex>
						</Flex>
					</Flex>
					<BannerRow config={config.banner5} theme={this.props.theme} />
					<Section id="examples">
						<Layout>
							<div className={titleRow}>
								<H3>{config.banner6.title}</H3>
								<Button
									style={{
										backgroundColor: secondary,
										...button,
									}}
									uppercase
									primary
									href={config.banner6.button.href}
								>
									{config.banner6.button.title}
								</Button>
							</div>
							<Grid
								size={3}
								mdSize={2}
								smSize={1}
								gutter="15px"
								smGutter="0px"
								style={{ marginBottom: '50px' }}
							>
								{config.banner6.demos.map((d, index) => (
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
								primary
								style={{
									backgroundColor: secondary,
									margin: '25px 0 30px',
									...button,
								}}
							>
								BUILD MY FIRST APP
							</Button>

							<H2>Need Help?</H2>
							<p>Resources to get help with Reactive Maps.</p>

							<SupportGrid />
						</Layout>
					</Section>
					<Footer />
				</Base>
			</ThemeProvider>
		);
	}
}
HomePage.propTypes = {
	config: PropTypes.object,
	theme: PropTypes.object,
};
export default HomePage;
