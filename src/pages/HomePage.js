import React, { Component } from 'react';
import { Navbar, Logo, Button, H1, H2, H3, Title, Flex, Text, GithubButton, Grid } from '@appbaseio/designkit';
import { Link } from 'react-router-dom';
import { ThemeProvider } from 'emotion-theming';
import webConfig from './../constants/config/web';
import { secondary, primary } from './../constants';
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

	const isVisible = Ti <= (window.innerHeight / 2) && elemBottom >= 0;
	return ({ isVisible, Ti });
}

export default class HomePage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			origin: 0,
		};
	}

	componentDidMount() {
		const el = document.getElementById('code');

		window.addEventListener('scroll', () => {
			const { isVisible, Ti } = isScrolledIntoView(el);

			const L = 1850;
			const K = 500;
			const Tc = window.innerHeight / 2;
			const delta = Tc - Ti;
			const scroll = Math.min((delta * L) / K, L - K);

			if (isVisible) {
				this.setState({
					origin: (scroll * -1),
				});
			} else if (Tc < Ti) {
				this.setState({
					origin: 0,
				});
			}
		});

		window.scrollTo(0, 0);
	}

	openLink(link) {
		window.open(link);
	}

	goToLink(link) {
		window.location = link;
	}

	render() {
		return (
			<ThemeProvider
				theme={{
					primaryColor: '#0033FF',
				}}
			>
				<Base>
					<Navbar style={{ backgroundColor: primary, color: '#fff' }} bold dark>
						<Navbar.Logo>
							<Logo light href={webConfig.header.logo.href}>
								<Logo.Icon css="color: #fff;">
									<img src={webConfig.header.logo.src} alt="Icon" />
								</Logo.Icon>
								<Logo.Light>{webConfig.header.logo.title.light}</Logo.Light>
								<Logo.Dark>{webConfig.header.logo.title.dark}</Logo.Dark>
							</Logo>
						</Navbar.Logo>
						<Navbar.List>
							{
								webConfig.header.links.map((l, i) => (
									/* eslint-disable-next-line */
									<li key={i}>
										{/* eslint-disable-next-line */}
										<Link to={l.href}>{l.description.toUpperCase()}</Link>
									</li>
								))
							}
							<li className={showMobileFlex}>
								<a href={webConfig.urls.github}>GITHUB</a>
							</li>
							<li className="button">
								<Button
									style={{ backgroundColor: secondary }}
									href={webConfig.urls.support}
									bold
									uppercase
								>
									<img
										src="images/support.svg"
										style={{ marginRight: 8 }}
										alt="support"
									/>{' '}
									SUPPORT
								</Button>
							</li>
						</Navbar.List>
					</Navbar>
					<div className={banner}>
						<Layout>
							<div className="content">
								<H1 light>{webConfig.banner1.title}</H1>
								<p>{webConfig.banner1.description}</p>

								<div className="button-row">
									<GithubButton
										count={webConfig.githubCount}
										href={webConfig.urls.github}
									/>
									<Button
										href={webConfig.banner1.button.href}
										bold
										uppercase
										big
										primary
										style={{ backgroundColor: secondary }}
									>
										{webConfig.banner1.button.title}
									</Button>
									<SecondaryLink href={webConfig.banner1.link.href}>
										{webConfig.banner1.link.title}
									</SecondaryLink>
								</div>
							</div>
							<div className="bg-image" />
						</Layout>
					</div>
					<Row>
						<Layout>
							<div className={hideMobile}>
								<img src={webConfig.banner2.image.src} width="100%" alt={webConfig.banner2.image.alt} />
							</div>
							<div className={vcenter}>
								<H2>{webConfig.banner2.title}</H2>
								<img
									className={showMobile}
									src={webConfig.banner2.image.mobile.src}
									srcSet={webConfig.banner2.image.mobile.srcSet}
									width="100%"
									alt="Components"
									style={{ marginTop: 30 }}
								/>
								<p>
									{webConfig.banner2.description}
								</p>
								<div className="button-row">
									<Button
										href={webConfig.banner2.button.href}
										bold
										uppercase
										big
										primary
										style={{
											backgroundColor: secondary,
										}}
									>
										{webConfig.banner2.button.title}
									</Button>
									<SecondaryLink
										href={webConfig.banner2.link.href}
										primary
										style={{
											color: primary,
										}}
									>
										{webConfig.banner2.link.title}
									</SecondaryLink>
								</div>
								<p>
									Get{' '}
									<a href={webConfig.banner2.sketch.href}>
										our designer templates
									</a>{' '}
									for sketch.
								</p>
							</div>
						</Layout>
					</Row>
					<Section>
						<Layout>
							<H2>{webConfig.banner3.title}</H2>
							<p>{webConfig.banner3.description}</p>
							<Grid
								size={3}
								mdSize={2}
								smSize={1}
								gutter="50px"
								style={{ marginTop: '60px' }}
							>
								{
									webConfig.banner3.cards.map((cardI, i) => (
										// eslint-disable-next-line
										<ActionCard key={i}>
											<ActionCard.Icon>
												<img src={cardI.image.src} alt={cardI.image.alt} />
											</ActionCard.Icon>
											<Title>{cardI.title}</Title>
											<p>
												{cardI.description}
											</p>
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
									))
								}
							</Grid>
						</Layout>
					</Section>
					<Flex
						padding="3rem 3rem 1rem"
						flexDirection="column"
						justifyContent="center"
						alignItems="center"
					>
						<H2>{webConfig.banner4.title}</H2>
						<Text
							fontSize="1rem"
							lineHeight="1.5rem"
							style={{ maxWidth: '600px', textAlign: 'center' }}
						>
							{webConfig.banner4.description}
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
					<BannerRow config={webConfig.banner5} />
					<Section>
						<Layout>
							<div className={titleRow}>
								<H3>{webConfig.banner6.title}</H3>
								<Button
									style={{ backgroundColor: secondary }}
									bold
									uppercase
									primary
									href={webConfig.banner6.button.href}
								>
									{webConfig.banner6.button.title}
								</Button>
							</div>
							<Grid
								size={4}
								mdSize={2}
								smSize={1}
								gutter="15px"
								smGutter="0px"
								style={{ marginBottom: '50px' }}
							>
								{
									webConfig.banner6.demos.map((d, index) => (
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
									))
								}
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
								href="https://opensource.appbase.io/reactive-manual/getting-started/reactivemaps.html"
								bold
								uppercase
								big
								primary
								style={{
									backgroundColor: secondary,
									margin: '25px 0 30px',
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
