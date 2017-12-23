import React, { Component } from 'react';
import { Flex, H1, H2, Title, Button, Text } from '@appbaseio/designkit';

import Navbar, { logo } from '../styles/Navbar';
import { SlopeWrapper, Slope, WhiteBackdrop } from '../styles/Slope';
import { boldHeading, button, col, colored, decoratedLink, decoratedSecondaryLink, card, title, code } from '../styles/base';
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

		setTimeout(() => {
			window.scrollTo(0, 0);
		}, 50);

		window.addEventListener('scroll', () => {
			const { isVisible, Ti } = isScrolledIntoView(el);

			const L = 1850,
				K = 500;
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
					<a className={`${boldHeading} ${logo}`} href="">Reactivesearch</a>
					<ul>
						<li><a href="">Examples</a></li>
						<li><a href="">Documentation</a></li>
						<li><a href="">Github</a></li>
					</ul>
				</Navbar>
				<SlopeWrapper>
					<Flex justifyContent="space-between">
						<Slope border />
						<Flex className={col} flexDirection="column" padding="0 0 0 3rem" justifyContent="center">
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
							><span className={`${boldHeading} ${logo}`}>v2</span> Now moar configurable, lighter and performant. <a className={`${decoratedSecondaryLink} ${decoratedLink}`} href="https://github.com/appbaseio/reactivesearch">Open source licensed</a>.
							</Text>

							<Flex>
								<Button light style={{ borderRadius: "2px" }} primary className={button}>Getting Started</Button>
								<Button transparent light className={button} style={{ marginLeft: '10px' , borderRadius: "2px" }}>View Components</Button>
							</Flex>
						</Flex>

						<Flex style={{ position: 'absolute', right: 0 }}>
							<img height="590px" src="images/browser.png" alt="Reactivesearch" style={{ boxShadow: '0 5px 24px 0 rgba(0,0,0,0.3)' }} />
						</Flex>
						<WhiteBackdrop degree={-15} />
					</Flex>
				</SlopeWrapper>

				<Flex padding="0 3rem 3rem">
					<div className={col}>
						<img width="100%" src="images/components.png" alt="Reactivesearch Components" />
					</div>

					<Flex className={col} flexDirection="column" justifyContent="center" padding="5rem 1rem">
						<H2 className={colored}>Components for every occasion</H2>
						<Text theme={{ textDark: "#424242" }} fontSize="1rem" lineHeight="1.6rem">Build and ship faster: E-commerce stores, personalized feeds, realtime search experiences with over 30 UI components.</Text>
						<a className={decoratedLink} href="">View components</a>
						<H2 style={{ paddingTop: "1rem" }} className={colored}>Progressively add components</H2>
						<Text theme={{ textDark: "#424242" }} fontSize="1rem" lineHeight="1.6rem">Bring your existing UI components to Reactivesearch, one component at a time. <br/> Start building things in no time!</Text>
						<a className={decoratedLink} href="">Custom components</a>
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
					<Flex margin="2rem 0" justifyContent="space-between" style={{ width: '100%', flexWrap: 'wrap' }}>
						<Flex
							className={card}
							flexDirection="column"
							alignItems="center"
							justifyContent="center"
							padding="1rem"
							backgroundColor="#fff"
						>
							<Title margin="0" fontWeight="700" fontSize="1rem">Build data-driven UIs</Title>
							<Text margin="12px 0 0">30+ prebuilt components: Lists, Ranges, Dates, Search, Results and more.</Text>
						</Flex>

						<Flex
							className={card}
							flexDirection="column"
							alignItems="center"
							justifyContent="center"
							padding="1rem"
							backgroundColor="#fff"
						>
							<Title margin="0" fontWeight="700" fontSize="1rem">Bring your components</Title>
							<Text margin="12px 0 0">Wrap your React components inside ReactiveComponent and allow them to interact with the backend.</Text>
						</Flex>

						<Flex
							className={card}
							flexDirection="column"
							alignItems="center"
							justifyContent="center"
							padding="1rem"
							backgroundColor="#fff"
						>
							<Title margin="0" fontWeight="700" fontSize="1rem">Configurable styles</Title>
							<Text margin="12px 0 0">Styled components with rich theming, classname and inline style injection  support.</Text>
						</Flex>

						<Flex
							className={card}
							flexDirection="column"
							alignItems="center"
							justifyContent="center"
							padding="1rem"
							backgroundColor="#fff"
						>
							<Title margin="0" fontWeight="700" fontSize="1rem">Elasticsearch compatible</Title>
							<Text margin="12px 0 0">Connect to an ES index hosted anywhere. Supports v2, v5 and v6.</Text>
						</Flex>

						<Flex
							className={card}
							flexDirection="column"
							alignItems="center"
							justifyContent="center"
							padding="1rem"
							backgroundColor="#fff"
						>
							<Title margin="0" fontWeight="700" fontSize="1rem">Write less code</Title>
							<Text margin="12px 0 0">Reactivesearch provides scaffolding for UI rendering, handling query requests and managing state.</Text>
						</Flex>

						<Flex
							className={card}
							flexDirection="column"
							alignItems="center"
							justifyContent="center"
							padding="1rem"
							backgroundColor="#fff"
						>
							<Title margin="0" fontWeight="700" fontSize="1rem">Easy to secure</Title>
							<Text margin="12px 0 0">Use appbase.io to get read-only credentials, or set up a middleware proxy with authorization rules. See example.</Text>
						</Flex>

						<Flex
							className={card}
							flexDirection="column"
							alignItems="center"
							justifyContent="center"
							padding="1rem"
							backgroundColor="#fff"
						>
							<Title margin="0" fontWeight="700" fontSize="1rem">Customizable Queries</Title>
							<Text margin="12px 0 0">Components come with query defaults, that can be customized or overwritten. 100% Query DSL supported.</Text>
						</Flex>


						{/*<!--Flex
							className={card}
							flexDirection="column"
							alignItems="center"
							justifyContent="center"
							padding="1rem"
							backgroundColor="#fff"
						>
							<Title margin="0" fontWeight="700" fontSize="1rem">Build cross-platform UIs</Title>
							<Text margin="12px 0 0">Build native iOS and Android UIs with Reactivesearch. <a className={decoratedLink} style={{ fontSize: "0.9rem" }} href="https://producthunt.com/upcoming/reactivesearch-native" target="_blank">Coming soon</a></Text>
						</Flex-->*/}

						<Flex
							className={card}
							flexDirection="column"
							alignItems="center"
							justifyContent="center"
							padding="1rem"
							backgroundColor="#fff"
						>
							<Title margin="0" fontWeight="700" fontSize="1rem">Starter Apps</Title>
							<Text margin="12px 0 0">Get started quickly by using any of our pre-configured starter apps. See examples.</Text>
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
						<H2 className={colored}>Build your own v/s Reactivesearch</H2>
						<Text fontSize="1rem" lineHeight="1.4rem">With less code, you need to solve fewer edge cases.</Text>
						<Text>Reactivesearch handles UI rendering, query requests and manages response state so you can focus on the product experience.</Text>

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
								<p className={title} style={{ backgroundColor: '#22C91A' }}>With Reactivesearch</p>
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
					flexDirection="column"
					justifyContent="center"
					alignItems="center"
					padding="7rem 3rem 0"
				>
					<H2 className={colored}>Reactivesearch In Action</H2>
					<Text fontSize="1rem" lineHeight="1.5rem" style={{ maxWidth: '600px', textAlign: 'center' }}>
						Check out these starter apps.
					</Text>

					<Flex padding="30px" justifyContent="space-between" style={{ width: '100%' }} margin="0 40px 40px" flexWrap="wrap">
						<div style={{
							width: '49%', height: '500px', margin: '12px 0', backgroundColor: '#eee',
						}}
						/>
						<div style={{
							width: '49%', height: '500px', margin: '12px 0', backgroundColor: '#eee',
						}}
						/>
						<div style={{
							width: '49%', height: '500px', margin: '12px 0', backgroundColor: '#eee',
						}}
						/>
						<div style={{
							width: '49%', height: '500px', margin: '12px 0', backgroundColor: '#eee',
						}}
						/>
						<div style={{
							width: '49%', height: '500px', margin: '12px 0', backgroundColor: '#eee',
						}}
						/>
						<div style={{
							width: '49%', height: '500px', margin: '12px 0', backgroundColor: '#eee',
						}}
						/>
					</Flex>
				</Flex>

				<Flex
					padding="1.5rem"
					backgroundColor="#fafafa"
					justifyContent="center"
					alignItems="center"
				>
					<Text>Powered by appbase.io</Text>
				</Flex>
			</div>
		);
	}
}
