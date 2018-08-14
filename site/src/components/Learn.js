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
							<H1>Get Started with Reactive Search</H1>
							<p className={titleText}>
								Use our step-by-step guide to learn all about Reactive Maps, or check out our{' '}
								<a
									rel="noopener noreferrer"
									href="https://opensource.appbase.io/reactive-manual/"
									target="_blank"
								>
									docs
								</a>
								.
							</p>

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
								<div className={stepCard}>
									<span className="count" style={{ color: theme.primaryDark }}>
										1
									</span>
									<div>
										<Title>Install Reactive X</Title>
										<p>
											ReactiveSearch is a set of Elasticsearch components for building data-driven
											UIs.
										</p>
										<p>
											ReactiveMaps is an extension of ReactiveSearch that provides map focused UI
											components.
										</p>
									</div>
									<div className="full">
										<pre>
											<code>npm install @appbaseio/reactivesearch</code>
										</pre>
										<pre>
											<code>npm install @appbaseio/reactivemaps</code>
										</pre>
									</div>
								</div>

								<div className={stepCard}>
									<span className="count" style={{ color: theme.primaryDark }}>
										2
									</span>
									<div>
										<Title>Add Google Maps JS</Title>
										<p>
											ReactiveMaps use Google Maps to render the map component. You can add the
											following script in the &lt;head&gt; element of your main .html file.
										</p>
										<p>
											Get the{' '}
											<a
												rel="noopener noreferrer"
												href="https://developers.google.com/maps/documentation/javascript/get-api-key"
												target="_blank"
											>
												API Key
											</a>{' '}
											and info on how to add the Maps script.
										</p>
									</div>
									<div>
										<SecondaryLink
											primary
											rel="noopener noreferrer"
											href="https://opensource.appbase.io/reactive-manual/getting-started/reactivemaps.html"
											target="_blank"
											style={{ color: theme.primaryDark }}
										>
											Step-by-step installation guide
										</SecondaryLink>
									</div>
								</div>

								<div className={stepCard}>
									<span className="count" style={{ color: theme.primaryDark }}>
										3
									</span>
									<div>
										<Title>Connect to your ES index</Title>
										<p>
											ReactiveMaps components can connect to an Elasticsearch index (hosted
											anywhere) for performing geospatial queries.
										</p>
										<p>
											Create a free app with{' '}
											<a rel="noopener noreferrer" href="https://appbase.io" target="_blank">
												appbase.io
											</a>
											, or{' '}
											<a
												rel="noopener noreferrer"
												href="https://opensource.appbase.io/reactive-manual/getting-started/reactivebase.html#connect-to-elasticsearch"
												target="_blank"
											>
												learn more
											</a>{' '}
											on how to connect with your Elasticsearch.
										</p>
									</div>
								</div>

								<div className={stepCard}>
									<span className="count" style={{ color: theme.primaryDark }}>
										4
									</span>
									<div>
										<Title>Create or import dataset</Title>
										<p>
											Use Dejavu, an open-source databrowser from appbase.io to create, view, edit
											and import dataset into your Elasticsearch index.
										</p>
									</div>
									<div>
										<SecondaryLink
											primary
											rel="noopener noreferrer"
											href="https://opensource.appbase.io/dejavu/"
											target="_blank"
											style={{ color: theme.primaryDark }}
										>
											Dejavu
										</SecondaryLink>
										<SecondaryLink
											primary
											rel="noopener noreferrer"
											href="https://opensource.appbase.io/reactive-manual/getting-started/data.html"
											target="_blank"
											style={{
												marginLeft: '1rem',
												color: theme.primaryDark,
											}}
										>
											Import data
										</SecondaryLink>
									</div>
								</div>

								<div className={stepCard}>
									<span className="count" style={{ color: theme.primaryDark }}>
										5
									</span>
									<div>
										<Title>UI Components</Title>
										<p>
											Add UI components for{' '}
											<a
												rel="noopener noreferrer"
												href="https://opensource.appbase.io/reactive-manual/map-components/geodistanceslider.html"
												target="_blank"
											>
												Maps
											</a>
											,{' '}
											<a
												rel="noopener noreferrer"
												href="https://opensource.appbase.io/reactive-manual/list-components/singlelist.html"
												target="_blank"
											>
												List
											</a>
											,{' '}
											<a
												rel="noopener noreferrer"
												href="https://opensource.appbase.io/reactive-manual/range-components/singlerange.html"
												target="_blank"
											>
												Range
											</a>
											,{' '}
											<a
												rel="noopener noreferrer"
												href="https://opensource.appbase.io/reactive-manual/search-components/datasearch.html"
												target="_blank"
											>
												Search
											</a>
											,{' '}
											<a
												rel="noopener noreferrer"
												href="https://opensource.appbase.io/reactive-manual/result-components/resultlist.html"
												target="_blank"
											>
												Results
											</a>
											.
										</p>
									</div>
									<div>
										<SecondaryLink
											style={{ color: theme.primaryDark }}
											primary
											rel="noopener noreferrer"
											href="https://opensource.appbase.io/reactive-manual/getting-started/componentsindex.html"
											target="_blank"
										>
											Component Docs
										</SecondaryLink>
									</div>
								</div>

								<div className={stepCard}>
									<span className="count" style={{ color: theme.primaryDark }}>
										6
									</span>
									<div>
										<Title>Maps for React Native</Title>
										<p>ReactiveMaps is also available in preview for React Native.</p>
									</div>
									<div>
										<SecondaryLink primary style={{ color: theme.primaryDark }}>
											Quickstart with React Native
										</SecondaryLink>
									</div>
								</div>
							</Grid>
						</Layout>
					</Section>

					<BannerRow config={config.banner} theme={theme} />

					<Section>
						<Layout>
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

Learn.propTypes = {
	config: PropTypes.object,
	theme: PropTypes.object,
};
export default Learn;
