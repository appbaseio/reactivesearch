import React, { Component } from 'react';
import { Flex, H1, H2, Title, Button, Text } from '@appbaseio/designkit';

import Navbar, { logo } from '../styles/Navbar';
import { SlopeWrapper, Slope, WhiteBackdrop } from '../styles/Slope';
import Bubble from '../styles/Bubble';
import {
	boldHeading,
	button,
	col,
	colored,
	decoratedLink,
	decoratedSecondaryLink,
	card,
	title,
	code,
	showcase,
	footer,
} from '../styles/base';
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

	render() {
		return (
			<div>
				<Navbar>
					<a className={`${boldHeading} ${logo}`} href="/">Reactivesearch</a>
					<ul>
						<li><a href="#examples">Examples</a></li>
						<li><a href="htpps://opensource.appbase.io/reactive-manual">Documentation</a></li>
						<li><a href="https://github.com/appbaseio/reactivesearch">Github</a></li>
					</ul>
				</Navbar>
				<SlopeWrapper>
					<Flex justifyContent="space-between">
						<Slope border />
						<Flex
							className={col}
							flexDirection="column"
							padding="0 0 0 3rem"
							justifyContent="center"
						>
							<H1
								fontWeight="700"
								fontSize="2rem"
								lineHeight="2.6rem"
								margin="40px 0 10px"
								className={boldHeading}
							>React UI components for Elasticsearch
							</H1>

							<Text
								fontSize="1rem"
								lineHeight="1.4rem"
								margin="10px 0 30px"
								light
							>
								<span className={`${boldHeading} ${logo}`}>v2</span> Now
								moar configurable, lighter and performant -&nbsp;
								<a
									className={`${decoratedLink} ${decoratedSecondaryLink}`}
									target="_blank"
									rel="noopener noreferrer"
									href="https://github.com/appbaseio/reactivesearch"
								>Open source licensed
								</a>
							</Text>

							<Flex>
								<Button light primary shadow className={button}>
									Getting Started
								</Button>
								<Button shadow className={button} style={{ marginLeft: '10px' }}>
									View Components
								</Button>
							</Flex>
						</Flex>

						<Flex style={{ position: 'absolute', right: 0 }}>
							<img
								height="590px"
								src="images/browser.png"
								alt="Reactivesearch"
								style={{ boxShadow: '0 5px 24px 0 rgba(0,0,0,0.3)' }}
							/>
						</Flex>
						<WhiteBackdrop degree={-15} />
					</Flex>
				</SlopeWrapper>

				<Flex padding="0 3rem 3rem">
					<div className={col}>
						<img
							width="100%"
							src="images/components.png"
							alt="Reactivesearch Components"
						/>
					</div>

					<Flex
						className={col}
						flexDirection="column"
						justifyContent="center"
						padding="5rem 1rem"
					>
						<H2 className={colored}>Components for every occasion</H2>
						<Text fontSize="1rem" lineHeight="1.6rem">
							Build and ship faster: E-commerce stores, personalized feeds, realtime
							search experiences with over 30 UI components.
						</Text>
						<div>
							<Button
								className={button}
								shadow
								primary
								target="_blank"
								rel="noopener noreferrer"
								href="https://opensource.appbase.io/playground"
							>
								View components
							</Button>
						</div>
					</Flex>
				</Flex>

				<Flex
					padding="3rem"
					flexDirection="column"
					backgroundColor="#fefefe"
					justifyContent="center"
					alignItems="center"
				>
					<H2>Up to 10x Time Savings</H2>
					<Text fontSize="1rem" lineHeight="1.6rem">
						Focus on the design and user experience, let us handle the details.
					</Text>
					<Flex
						margin="2rem 0"
						justifyContent="space-between"
						style={{ width: '100%', flexWrap: 'wrap' }}
					>
						<Flex className={card}>
							<div>
								<img src="images/octocat.png" alt="Data-driven UIs" />
							</div>
							<Title margin="0" fontWeight="700" fontSize="1rem">
								Build data-driven UIs
							</Title>
							<Text margin="12px 0 0" lineHeight="1.3rem">
								30+ prebuilt components: Lists, Ranges, Dates, Search, Results
								and more.
							</Text>
						</Flex>

						<Flex className={card}>
							<div>
								<img src="images/octocat.png" alt="Data-driven UIs" />
							</div>
							<Title margin="0" fontWeight="700" fontSize="1rem">
								Bring your components
							</Title>
							<Text margin="12px 0 0" lineHeight="1.3rem">
								Wrap your React components inside ReactiveComponent and allow
								them to interact with the backend.
							</Text>
						</Flex>

						<Flex className={card}>
							<div>
								<img src="images/octocat.png" alt="Data-driven UIs" />
							</div>
							<Title margin="0" fontWeight="700" fontSize="1rem">
								Configurable styles
							</Title>
							<Text margin="12px 0 0" lineHeight="1.3rem">
								Styled components with rich theming, classname and inline
								style injection  support.
							</Text>
						</Flex>

						<Flex className={card}>
							<div>
								<img src="images/octocat.png" alt="Data-driven UIs" />
							</div>
							<Title margin="0" fontWeight="700" fontSize="1rem">
								Elasticsearch compatible
							</Title>
							<Text margin="12px 0 0" lineHeight="1.3rem">
								Connect to an ES index hosted anywhere. Supports v2, v5 and v6.
							</Text>
						</Flex>

						<Flex className={card}>
							<div>
								<img src="images/octocat.png" alt="Data-driven UIs" />
							</div>
							<Title margin="0" fontWeight="700" fontSize="1rem">Write less code</Title>
							<Text margin="12px 0 0" lineHeight="1.3rem">
								Reactivesearch provides scaffolding for UI rendering, handling
								query requests and managing state.
							</Text>
						</Flex>

						<Flex className={card}>
							<div>
								<img src="images/octocat.png" alt="Data-driven UIs" />
							</div>
							<Title margin="0" fontWeight="700" fontSize="1rem">Easy to secure</Title>
							<Text margin="12px 0 0" lineHeight="1.3rem">
								Use appbase.io to get read-only credentials, or set up a
								middleware proxy with authorization rules. See example.
							</Text>
						</Flex>

						<Flex className={card}>
							<div>
								<img src="images/octocat.png" alt="Data-driven UIs" />
							</div>
							<Title margin="0" fontWeight="700" fontSize="1rem">Customizable Queries</Title>
							<Text margin="12px 0 0" lineHeight="1.3rem">
								Components come with query defaults, that can be customized or
								overwritten. 100% Query DSL supported.
							</Text>
						</Flex>


						{/*
							<!--Flex
							className={card}
							flexDirection="column"
							alignItems="center"
							justifyContent="center"
							padding="1rem"
							backgroundColor="#fff"
						>
							<Title margin="0" fontWeight="700" fontSize="1rem">Build cross-platform UIs</Title>
							<Text margin="12px 0 0" lineHeight="1.3rem">Build native iOS and Android UIs with Reactivesearch. <a className={decoratedLink} style={{ fontSize: "0.9rem" }} href="https://producthunt.com/upcoming/reactivesearch-native" target="_blank">Coming soon</a></Text>
							</Flex-->
						*/}

						<Flex className={card}>
							<div>
								<img src="images/octocat.png" alt="Data-driven UIs" />
							</div>
							<Title margin="0" fontWeight="700" fontSize="1rem">Starter Apps</Title>
							<Text margin="12px 0 0" lineHeight="1.3rem">
								Get started quickly by using any of our pre-configured starter
								apps. See examples.
							</Text>
						</Flex>
					</Flex>
				</Flex>

				<SlopeWrapper small>
					<Slope style={{ backgroundImage: 'linear-gradient(to top, #dfe9f3 0%, white 100%)' }} />
					<Flex
						padding="3rem 3rem 1rem"
						flexDirection="column"
						justifyContent="center"
						alignItems="center"
					>
						<H2 className={colored}>Write Less Code</H2>
						<Text
							fontSize="1rem"
							lineHeight="1.5rem"
							style={{ maxWidth: '600px', textAlign: 'center' }}
						>
							Reactivesearch handles UI rendering, query requests and manages
							response state so you can focus on the product experience.
						</Text>

						<Flex
							padding="30px 30px 0"
							justifyContent="center"
							margin="12px 0 10px"
							style={{ width: '100%', textAlign: 'left' }}
						>
							<Flex className={code}>
								<p className={title}>Without Reactivesearch</p>
							</Flex>

							<Flex className={code} margin="0">
								<p className={title} style={{ backgroundColor: '#22C91A' }}>
									With Reactivesearch
								</p>
							</Flex>
						</Flex>
						<Flex padding="0 30px" justifyContent="center">
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
				</SlopeWrapper>

				<Flex
					className={showcase}
					flexDirection="column"
					backgroundColor="#fff"
					boxShadow="0 15px 35px rgba(50,50,93,.1), 0 5px 15px rgba(0,0,0,.07)"
				>
					<H2 margin="1rem 0 0.5rem">Excited much?</H2>
					<Text>Don&apos;t hold yourself. Get onboard!</Text>
					<Button shadow primary className={button}>Build a live app in minutes</Button>
				</Flex>

				<Flex
					flexDirection="column"
					justifyContent="center"
					alignItems="center"
					padding="7rem 3rem 0"
				>
					<H2 className={colored}>Reactivesearch In Action</H2>
					<Text
						fontSize="1rem"
						lineHeight="1.5rem"
						style={{ maxWidth: '600px', textAlign: 'center' }}
					>
						Check out these starter apps.
					</Text>

					<Flex
						padding="30px"
						justifyContent="center"
						style={{ width: '100%' }}
						margin="0 40px 40px"
						flexWrap="wrap"
					>
						<div style={{
							width: '39%', height: '400px', margin: '20px', borderRadius: '10px', backgroundColor: '#fafafa',
						}}
						/>
						<div style={{
							width: '39%', height: '400px', margin: '20px', borderRadius: '10px', backgroundColor: '#fafafa',
						}}
						/>
						<div style={{
							width: '39%', height: '400px', margin: '20px', borderRadius: '10px', backgroundColor: '#fafafa',
						}}
						/>
						<div style={{
							width: '39%', height: '400px', margin: '20px', borderRadius: '10px', backgroundColor: '#fafafa',
						}}
						/>
						<div style={{
							width: '39%', height: '400px', margin: '20px', borderRadius: '10px', backgroundColor: '#fafafa',
						}}
						/>
						<div style={{
							width: '39%', height: '400px', margin: '20px', borderRadius: '10px', backgroundColor: '#fafafa',
						}}
						/>
					</Flex>
				</Flex>

				<Flex
					flexDirection="column"
					justifyContent="center"
					alignItems="center"
					padding="3rem 3rem 4rem"
				>
					<H2>Testimonials</H2>
					<Bubble>
						The time savings have been off the charts in getting our
						search up and running with searchbase.io
					</Bubble>

					<Text>Rob Whitley, Co-Founder, Salespipe</Text>
				</Flex>

				<Flex
					backgroundColor="#fafafa"
					justifyContent="center"
					alignItems="center"
					padding="100px 3rem 50px"
					style={{
						backgroundImage: 'linear-gradient(to top, rgb(223, 233, 243) 0%, white 100%)',
					}}
				>
					<Flex
						style={{
							width: '100%',
							maxWidth: '950px',
						}}
					>
						<Flex className={col}>
							<div style={{ textAlign: 'center' }}>
								<img style={{ maxWidth: '400px' }} width="100%" src="images/banner.png" alt="Signup on appbase.io" />
							</div>
						</Flex>

						<Flex
							className={col}
							flexDirection="column"
						>
							<H2
								fontWeight="700"
								fontSize="1.8rem"
								lineHeight="2.4rem"
								margin="0 0 12px 0"
								style={{ maxWidth: '450px' }}
							>
								Build your Elasticsearch backend with appbase.io
							</H2>
							<Text fontSize="1.2rem" lineHeight="1.5rem">
								Get a free account for up to 10,000 records.
							</Text>
							<div>
								<Button
									primary
									shadow
									className={button}
									href="https://appbase.io"
									target="_blank"
									rel="noopener noreferrer"
								>
									Signup for free
								</Button>
							</div>
						</Flex>
					</Flex>
				</Flex>

				<Flex
					padding="4rem 3rem"
					justifyContent="space-around"
					alignItems="flex-start"
					backgroundColor="#2E2A51"
					light
					className={footer}
				>
					<Flex flexDirection="column">
						<div className="logo">
							<img width="200" src="images/logo.svg" alt="Powered by appbase.io" />
						</div>
					</Flex>

					<Flex>
						<Flex className="column" flexDirection="column">
							<Title className="heading">Documentation</Title>
							<Text light margin="3px 0"><a href="/">Quick Start</a></Text>
							<Text light margin="3px 0"><a href="/">Basic Components</a></Text>
							<Text light margin="3px 0"><a href="/">Map Components</a></Text>
							<Text light margin="3px 0"><a href="/">Advanced options</a></Text>
						</Flex>

						<Flex className="column" flexDirection="column">
							<Title className="heading">Community</Title>
							<Text light margin="3px 0"><a href="/">Github</a></Text>
							<Text light margin="3px 0"><a href="/">Slack</a></Text>
							<Text light margin="3px 0"><a href="/">Twitter</a></Text>
						</Flex>

						<Flex className="column" flexDirection="column">
							<Title className="heading">Helpful Tools</Title>
							<Text light margin="3px 0"><a href="/">Data Browser</a></Text>
							<Text light margin="3px 0"><a href="/">GUI Query Builder</a></Text>
						</Flex>

						<Flex className="column" flexDirection="column">
							<Title className="heading">More</Title>
							<Text light margin="3px 0"><a href="/">Blog</a></Text>
							<Text light margin="3px 0"><a href="/">Appbase.io docs</a></Text>
							<Text light margin="3px 0"><a href="/">Gitter</a></Text>
							<Text light margin="3px 0"><a href="/">Support Email</a></Text>
						</Flex>
					</Flex>
				</Flex>
			</div>
		);
	}
}
