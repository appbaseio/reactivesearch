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
							><span className={`${boldHeading} ${logo}`}>v2</span> Moar configurable, lighter and performant. <a className={`${decoratedSecondaryLink} ${decoratedLink}`} href="https://github.com/appbaseio/reactivesearch">Open source</a>.
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
						<H2 className={colored}>UI Components for every occasion</H2>
						<Text theme={{ textDark: "#424242" }} fontSize="1rem" lineHeight="1.6rem">Ecommerce, Search and Media apps, we have got you covered. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minus, sapiente.</Text>
						<a className={decoratedLink} href="">View components</a>
					</Flex>
				</Flex>

				<Flex
					padding="3rem"
					flexDirection="column"
					backgroundColor="#fefefe"
					justifyContent="center"
					alignItems="center"
				>
					<H2>Batteries included</H2>

					<Flex margin="2rem 0" justifyContent="space-between" style={{ width: '100%' }}>
						<Flex
							className={card}
							flexDirection="column"
							alignItems="center"
							justifyContent="center"
							padding="1rem"
							backgroundColor="#fff"
						>
							<Title margin="0" fontWeight="700" fontSize="1rem">Style as per your taste</Title>
							<Text margin="12px 0 0">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</Text>
						</Flex>

						<Flex
							className={card}
							flexDirection="column"
							alignItems="center"
							justifyContent="center"
							padding="1rem"
							backgroundColor="#fff"
						>
							<Title margin="0" fontWeight="700" fontSize="1rem">Customizable queries</Title>
							<Text margin="12px 0 0">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</Text>
						</Flex>

						<Flex
							className={card}
							flexDirection="column"
							alignItems="center"
							justifyContent="center"
							padding="1rem"
							backgroundColor="#fff"
						>
							<Title margin="0" fontWeight="700" fontSize="1rem">Completely Opensource</Title>
							<Text margin="12px 0 0">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</Text>
						</Flex>

						<Flex
							className={card}
							flexDirection="column"
							alignItems="center"
							justifyContent="center"
							padding="1rem"
							backgroundColor="#fff"
						>
							<Title margin="0" fontWeight="700" fontSize="1rem">Works with any elasticsearch cluster</Title>
							<Text margin="12px 0 0">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</Text>
						</Flex>

						<Flex
							className={card}
							flexDirection="column"
							alignItems="center"
							justifyContent="center"
							padding="1rem"
							backgroundColor="#fff"
						>
							<Title margin="0" fontWeight="700" fontSize="1rem">Offers 30+ components</Title>
							<Text margin="12px 0 0">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</Text>
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
						<H2 className={colored}>Build 10x faster</H2>
						<Text fontSize="1rem" lineHeight="1.4rem">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsa, cumque!</Text>

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
					<H2 className={colored}>Configure your search experiences</H2>
					<Text fontSize="1rem" lineHeight="1.5rem" style={{ maxWidth: '600px', textAlign: 'center' }}>
						Reactivesearch comes with a range of UI components making it easier for you to design the perfect search experience for your product.
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
