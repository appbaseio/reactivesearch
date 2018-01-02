import React, { Component } from 'react';
import { Flex, H1, H2, Title, Button, Text } from '@appbaseio/designkit';

import Navbar, { logo } from '../styles/Navbar';
import { SlopeWrapper, Slope, WhiteBackdrop } from '../styles/Slope';
import Bubble from '../styles/Bubble';
import Image from '../styles/Image';
import {
	container,
	boldHeading,
	button,
	col,
	colored,
	decoratedLink,
	decoratedSecondaryLink,
	card,
	code,
	showcase,
	footer,
	tabCol,
	tabCenterHeading,
	tabShow,
	tabHide,
	tabJustifyCenter,
	tabBanner,
	mobHide,
	textCenter,
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
			<div className={container}>
				<Navbar>
					<a className={`${boldHeading} ${logo}`} href="/">Reactivesearch</a>
					<ul className={mobHide}>
						<li><a href="#examples">Examples</a></li>
						<li><a href="htpps://opensource.appbase.io/reactive-manual">Documentation</a></li>
						<li><a href="https://github.com/appbaseio/reactivesearch">Github</a></li>
					</ul>
				</Navbar>
				<SlopeWrapper>
					<Flex justifyContent="space-between">
						<Slope border />
						<Flex
							className={`${col} ${tabBanner}`}
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
								<span className={`${boldHeading} ${logo} ${mobHide}`}>v2</span> Now
								moar configurable, lighter and performant.&nbsp;
								<a
									className={`${decoratedLink} ${decoratedSecondaryLink}`}
									target="_blank"
									rel="noopener noreferrer"
									href="https://github.com/appbaseio/reactivesearch"
								>Open-source licensed.
								</a>
							</Text>

							<Flex className={tabJustifyCenter}>
								<Button light primary shadow className={button}>
									Getting Started
								</Button>
								<Button shadow className={button} style={{ marginLeft: '10px' }}>
									View Components
								</Button>
							</Flex>
						</Flex>

						<Flex style={{ position: 'absolute', right: 0 }} className={tabHide}>
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

				<Flex padding="0 3rem 3rem" className={tabCol}>
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
							Build the perfect search experience using our UI components or by creating your own.
						</Text>
						<Text fontSize="1rem" lineHeight="1.6rem">
							30+ prebuilt components with customizable queries and configurable styles.
						</Text>
						<Flex className={tabJustifyCenter}>
							<Button
								className={button}
								shadow
								primary
								href="https://opensource.appbase.io/reactive-manual/base-components/textfield"
							>
								View components
							</Button>
							<Button
								transparent
								no-shadow
								className={button}
								style={{ border: 0, cursor: 'default' }}
							>
								or
							</Button>
							<Button
								className={button}
								href="https://opensource.appbase.io/reactive-manual/advanced/reactivecomponent"
							>
								Create your own
							</Button>
						</Flex>
					</Flex>
				</Flex>

				<Flex
					padding="3rem"
					flexDirection="column"
					backgroundColor="#fefefe"
					justifyContent="center"
					alignItems="center"
				>
					<H2 className={textCenter}>Up To 10x Time Savings</H2>
					<Text fontSize="1rem" lineHeight="1.6rem" className={textCenter}>
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
								Launch and iterate faster
							</Title>
							<Text margin="12px 0 0" lineHeight="1.3rem">
								30+ well-designed and performance optimized UI components. Ship faster and solve fewer edge cases.
							</Text>
						</Flex>

						<Flex className={card}>
							<div>
								<img src="images/octocat.png" alt="Data-driven UIs" />
							</div>
							<Title margin="0" fontWeight="700" fontSize="1rem">
								Works with existing UIs
							</Title>
							<Text margin="12px 0 0" lineHeight="1.3rem">
								Already have your own components? Bring them to ReactiveSearch.
							</Text>
						</Flex>

						<Flex className={card}>
							<div>
								<img src="images/configurablestyles.png" alt="Data-driven UIs" />
							</div>
							<Title margin="0" fontWeight="700" fontSize="1rem">
								Configurable styles
							</Title>
							<Text margin="12px 0 0" lineHeight="1.3rem">
								Styled components with rich theming and css class-injection support.
							</Text>
						</Flex>

						<Flex className={card}>
							<div>
								<img src="images/octocat.png" alt="Data-driven UIs" />
							</div>
							<Title margin="0" fontWeight="700" fontSize="1rem">Create cross-platform apps</Title>
							<Text margin="12px 0 0" lineHeight="1.3rem">
								Reactivesearch components can be ported to create native mobile UIs.
							</Text>
						</Flex>

						<Flex className={card}>
							<div>
								<img src="images/elasticsearch.png" alt="Data-driven UIs" />
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
								<img src="images/customizablequeries.png" alt="Data-driven UIs" />
							</div>
							<Title margin="0" fontWeight="700" fontSize="1rem">Customizable queries</Title>
							<Text margin="12px 0 0" lineHeight="1.3rem">
								Components come with good query defaults, that can be customized with Elasticsearch query DSL.
							</Text>
						</Flex>

						<Flex className={card}>
							<div>
								<img src="images/octocat.png" alt="Data-driven UIs" />
							</div>
							<Title margin="0" fontWeight="700" fontSize="1rem">Easy to secure</Title>
							<Text margin="12px 0 0" lineHeight="1.3rem">
								Use appbase.io to get read-only credentials, or set up a
								middleware proxy with authorization rules.
							</Text>
						</Flex>

						<Flex className={card}>
							<div>
								<img src="images/octocat.png" alt="Data-driven UIs" />
							</div>
							<Title margin="0" fontWeight="700" fontSize="1rem">Starter apps</Title>
							<Text margin="12px 0 0" lineHeight="1.3rem">
								Get started quickly by using any of our pre-configured starter apps.
							</Text>
						</Flex>
					</Flex>
				</Flex>

				<SlopeWrapper small className={tabHide}>
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
							response state so you can focus on the product experience,
							ship faster and iterate quicker.
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
				</SlopeWrapper>

				<Flex
					className={showcase}
					flexDirection="column"
					backgroundColor="#fff"
					boxShadow="0 15px 35px rgba(50,50,93,.1), 0 5px 15px rgba(0,0,0,.07)"
				>
					<H2 margin="1rem 0 0.5rem">See Reactivesearch In Action</H2>
					<Flex className={tabJustifyCenter}>
						<Button shadow primary className={button} style={{ maxWidth: "250px" }}>Build a live app in 5 mins</Button>
						<Button className={button} style={{ maxWidth: "250px", marginLeft: "1rem" }}>Read the docs</Button>
					</Flex>
				</Flex>

				<Flex
					flexDirection="column"
					justifyContent="center"
					alignItems="center"
					padding="7rem 3rem 0"
				>
					<H2 className={colored}>Checkout these starter apps</H2>

					<Flex
						justifyContent="center"
						style={{ width: '100%', maxWidth: '1100px' }}
						margin="30px 0 0"
						flexWrap="wrap"
					>
						<Image src="images/apps/airbeds.png" />
						<Image src="images/apps/productsearch.png" />
						<Image src="images/apps/gitxplore.png" />
						<Image src="images/apps/carstore.png" />
						<Image src="images/apps/goodbooks.png" />
						<Image src="images/apps/technews.png" />
					</Flex>
				</Flex>

				<Flex
					flexDirection="column"
					justifyContent="center"
					alignItems="center"
					padding="3rem 3rem 4rem"
				>
					<H2>Testimonials</H2>

					<Flex
						flexDirection="column"
						justifyContent="center"
						alignItems="flex-start"
						margin="30px 0 20px"
						style={{ width: '100%', maxWidth: '800px' }}
						className={tabHide}
					>
						<Bubble backgroundColor="#5846AB" big>
							The time savings have been off the charts in getting our
							search up and running with searchbase.io

							<footer>Rob Whitley, Co-Founder, Salespipe</footer>
						</Bubble>
					</Flex>
					<Flex
						flexDirection="column"
						justifyContent="center"
						alignItems="flex-end"
						style={{ width: '100%', maxWidth: '1100px' }}
						className={tabHide}
					>
						<Bubble>
							The time savings have been off the charts in getting our
							search up and running with searchbase.io

							<footer>Rob Whitley, Co-Founder, Salespipe</footer>
						</Bubble>
					</Flex>

					<Flex
						flexDirection="column"
						justifyContent="center"
						alignItems="flex-start"
						style={{ width: '100%', maxWidth: '900px' }}
						className={tabHide}
					>
						<Bubble backgroundColor="#5C67E1">
							The time savings have been off the charts in getting our
							search up and running with searchbase.io

							<footer>Rob Whitley, Co-Founder, Salespipe</footer>
						</Bubble>
					</Flex>

					<Flex
						flexDirection="column"
						justifyContent="center"
						alignItems="center"
						style={{ width: '100%', maxWidth: '900px' }}
						className={tabShow}
					>
						<Bubble backgroundColor="#5C67E1">
							The time savings have been off the charts in getting our
							search up and running with searchbase.io

							<footer>Rob Whitley, Co-Founder, Salespipe</footer>
						</Bubble>
					</Flex>
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
						className={tabCol}
					>
						<Flex className={col}>
							<div style={{ textAlign: 'center', margin: '0 auto' }}>
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
								className={tabCenterHeading}
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

					<Flex className="column-wrapper">
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
