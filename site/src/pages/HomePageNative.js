import React, { Component } from 'react';
import { Flex, H1, H2, Title, Button, Text } from '@appbaseio/designkit';

import Navbar, { logo } from '../styles/Navbar';
import { SlopeWrapper, Slope, WhiteBackdrop } from '../styles/Slope';
import Bubble from '../styles/Bubble';
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
	tabPadding,
	tabCol,
	tabShow,
	tabHide,
	tabJustifyCenter,
	tabBanner,
	mobHide,
	mobShow,
	mobBottomMargin,
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

export default class HomePageNative extends Component {
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
			<div className={container}>
				<Navbar small>
					<a href="/reactivesearch/native" className="img-logo">
						<img src="images/native/logo.png" alt="Reactivesearch" />
						<span>Reactivesearch Native</span>
					</a>
				</Navbar>
				<SlopeWrapper>
					<Flex justifyContent="space-between">
						<Slope degree={5} border>
							<Flex style={{ position: 'absolute', right: 0 }} className={tabHide}>
								<img
									src="images/native/landing.png"
									alt="Reactivesearch"
								/>
							</Flex>
						</Slope>
						<Flex
							className={`${col} ${tabBanner}`}
							flexDirection="column"
							padding="0 0 0 6rem"
							justifyContent="center"
						>
							<H1
								fontWeight="700"
								fontSize="1.8rem"
								lineHeight="2.4rem"
								margin="30px 0 10px"
								className={boldHeading}
							>React Native UI components for Elasticsearch
							</H1>

							<Text
								fontSize="1rem"
								lineHeight="1.4rem"
								margin="10px 0 30px"
								light
							>
								<span className={`${boldHeading} ${logo} ${mobHide}`}>v0.6</span>&nbsp;
								Build data-driven mobile apps.&nbsp;
								<a
									className={`${decoratedLink} ${decoratedSecondaryLink}`}
									target="_blank"
									rel="noopener noreferrer"
									href="https://github.com/appbaseio/reactivesearch"
								>
									Open-source licensed.
								</a>
							</Text>

							<Flex className={tabJustifyCenter}>
								<Button light primary shadow big className={button} href="https://opensource.appbase.io/reactive-manual/native/getting-started/reactivesearch.html">
									Get Started with React Native
								</Button>
								<Button shadow big className={button} style={{ marginLeft: '10px' }} href="/reactivesearch">
									<span style={{ marginLeft: 5, position: 'relative', top: 1 }}>React UI components</span>
								</Button>
							</Flex>
						</Flex>
						<WhiteBackdrop degree={-15} />
					</Flex>
				</SlopeWrapper>

				<Flex padding="0 3rem 3rem" className={tabCol}>
					<div className={col}>
						<H2 style={{ marginBottom: 35 }} className={`${colored} ${mobShow}`}>Components for every occasion</H2>
						<img
							width="100%"
							src="images/native/components.png"
							alt="Reactivesearch Components"
						/>
					</div>

					<Flex
						className={`${col} ${tabPadding}`}
						flexDirection="column"
						justifyContent="center"
						padding="5rem 1rem"
					>
						<H2 className={`${colored} ${mobHide}`}>Components for every occasion</H2>
						<Text fontSize="1rem" lineHeight="1.6rem">
							Build the perfect search experience using our UI components or by creating your own.
						</Text>
						<Text fontSize="1rem" lineHeight="1.6rem">
							Over 10 prebuilt components with customizable queries and configurable styles.
						</Text>
						<Flex className={tabJustifyCenter}>
							<Button
								className={button}
								shadow
								primary
								href="https://opensource.appbase.io/reactive-manual/native/components/textfield.html"
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
								className={`${button} ${mobBottomMargin}`}
								href="https://opensource.appbase.io/reactive-manual/native/advanced/reactivecomponent.html"
							>
								Create your own
							</Button>
						</Flex>

						<Flex flexDirection="column" className={tabJustifyCenter}>
							<Title>Get our iOS and Android specific designer templates for sketch.</Title>
							<Button href="resources/ReactiveSearchNative_Playground.sketch" warning shadow className={button} style={{ maxWidth: 220 }}>
								Download sketch file
							</Button>
						</Flex>
					</Flex>
				</Flex>

				<Flex
					padding="3rem"
					flexDirection="column"
					justifyContent="center"
					alignItems="center"
					className={tabPadding}
					style={{
						backgroundImage: 'linear-gradient(to top, #dfe9f3 0%, white 100%)',
					}}
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

						<Flex className={card} onClick={() => this.openLink('https://medium.appbase.io/build-your-next-react-native-app-with-reactivesearch-ce21829f3bf5')}>
							<div>
								<img src="images/rocket.png" alt="Data-driven UIs" />
							</div>
							<Title margin="0" fontWeight="700" fontSize="1rem">
								Launch and iterate faster
							</Title>
							<Text margin="12px 0 0" lineHeight="1.3rem">
								Well-designed and performance optimized UI components.
								Ship faster and solve fewer edge cases.
							</Text>
							<div className={mobShow}>
								<Button className={button}>Read More</Button>
							</div>
						</Flex>

						<Flex className={card} onClick={() => this.openLink('https://opensource.appbase.io/reactive-manual/native/advanced/reactivecomponent.html')}>
							<div>
								<img src="images/remix.png" alt="Data-driven UIs" />
							</div>
							<Title margin="0" fontWeight="700" fontSize="1rem">
								Works with existing UIs
							</Title>
							<Text margin="12px 0 0" lineHeight="1.3rem">
								Already have your own design components? Bring them to Reactivesearch Native.
							</Text>
							<div className={mobShow}>
								<Button className={button}>Read More</Button>
							</div>
						</Flex>

						<Flex className={card} onClick={() => this.openLink('https://opensource.appbase.io/reactive-manual/native/advanced/style.html')}>
							<div>
								<img src="images/configurablestyles.png" alt="Data-driven UIs" />
							</div>
							<Title margin="0" fontWeight="700" fontSize="1rem">
								Configurable styles
							</Title>
							<Text margin="12px 0 0" lineHeight="1.3rem">
								Styled components with rich theming and style injection support.
							</Text>
							<div className={mobShow}>
								<Button className={button}>Read More</Button>
							</div>
						</Flex>

						<Flex className={card} onClick={() => this.openLink('https://github.com/appbaseio/reactivesearch/tree/dev/packages/web')}>
							<div>
								<img src="images/devices.png" alt="Data-driven UIs" />
							</div>
							<Title margin="0" fontWeight="700" fontSize="1rem">Create cross-platform apps</Title>
							<Text margin="12px 0 0" lineHeight="1.3rem">
								All Native components have equivalent React UI components,
								allowing creation of consistent cross-platform apps.
							</Text>
							<div className={mobShow}>
								<Button className={button}>Read More</Button>
							</div>
						</Flex>

						<Flex className={card} onClick={() => this.openLink('https://opensource.appbase.io/reactive-manual/getting-started/native/reactivebase.html')}>
							<div>
								<img src="images/elasticsearch.png" alt="Data-driven UIs" />
							</div>
							<Title margin="0" fontWeight="700" fontSize="1rem">
								Elasticsearch compatible
							</Title>
							<Text margin="12px 0 0" lineHeight="1.3rem">
								Connect to an ES index hosted anywhere. Supports v2, v5 and v6.
							</Text>
							<div className={mobShow}>
								<Button className={button}>Read More</Button>
							</div>
						</Flex>

						<Flex className={card} onClick={() => this.openLink('https://opensource.appbase.io/reactive-manual/advanced/customquery.html')}>
							<div>
								<img src="images/customizablequeries.png" alt="Data-driven UIs" />
							</div>
							<Title margin="0" fontWeight="700" fontSize="1rem">Customizable queries</Title>
							<Text margin="12px 0 0" lineHeight="1.3rem">
								Components come with good query defaults,
								that can be customized with Elasticsearch query DSL.
							</Text>
							<div className={mobShow}>
								<Button className={button}>Read More</Button>
							</div>
						</Flex>

						<Flex className={card} onClick={() => this.openLink('https://opensource.appbase.io/reactive-manual/native/getting-started/reactivebase.html#connect-to-elasticsearch')}>
							<div>
								<img src="images/shield.png" alt="Data-driven UIs" />
							</div>
							<Title margin="0" fontWeight="700" fontSize="1rem">Easy to secure</Title>
							<Text margin="12px 0 0" lineHeight="1.3rem">
								Use appbase.io to get read-only credentials, or set up a
								middleware proxy with authorization rules.
							</Text>
							<div className={mobShow}>
								<Button className={button}>Read More</Button>
							</div>
						</Flex>

						<Flex className={card} onClick={() => this.goToLink('/native#examples')}>
							<div>
								<img src="images/blocks.png" alt="Data-driven UIs" />
							</div>
							<Title margin="0" fontWeight="700" fontSize="1rem">Starter apps</Title>
							<Text margin="12px 0 0" lineHeight="1.3rem">
								Get started quickly by using any of our pre-configured starter apps.
							</Text>
							<div className={mobShow}>
								<Button className={button}>Read More</Button>
							</div>
						</Flex>
					</Flex>
				</Flex>

				<SlopeWrapper small className={tabHide}>
					<Slope style={{ background: '#fff' }} />
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
					<H2 id="examples" margin="1rem 0 0.5rem">See Reactivesearch In Action</H2>
					<Flex className={tabJustifyCenter}>
						<Button shadow primary className={button} href="https://snack.expo.io/@metagrover/booksearch">Interactive Demo</Button>
						<Button className={button} style={{ marginLeft: '1rem' }} href="https://opensource.appbase.io/reactive-manual/native/">Read the docs</Button>
					</Flex>
				</Flex>

				<SlopeWrapper small style={{ marginTop: '-20px' }} className="no-tab-padding">
					<Slope style={{ backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }} />
					<Flex
						flexDirection="column"
						justifyContent="center"
						alignItems="center"
						padding="3rem 3rem 5rem"
						className={tabPadding}
					>
						<Flex
							flexDirection="row"
							justifyContent="space-around"
							alignItems="center"
							padding="3rem 0 0 0"
							style={{
								width: '95%',
								maxWidth: '900px',
							}}
							className={tabJustifyCenter}
						>
							<Flex flexDirection="column" justifyContent="center" alignItems="center">
								<a target="_blank" rel="noopener noreferrer" href="https://snack.expo.io/@metagrover/booksearch" className="demo">
									<img width="240" src="images/native/booksearch.png" alt="Demo app" />
								</a>
								<Button
									rel="noopener noreferrer"
									style={{ width: 140, marginTop: 0, marginBottom: 50 }}
									shadow
									className={button}
									href="https://snack.expo.io/@metagrover/booksearch"
								>
									Check Demo
								</Button>
							</Flex>

							<Flex flexDirection="column" justifyContent="center" alignItems="center">
								<a target="_blank" rel="noopener noreferrer" href="https://snack.expo.io/@dhruvdutt/gitxplore-native-app" className="demo">
									<img width="240" src="images/native/gitxplore.png" alt="Demo app" />
								</a>
								<Button
									rel="noopener noreferrer"
									style={{ width: 140, marginTop: 0, marginBottom: 50 }}
									shadow
									className={button}
									href="https://snack.expo.io/@dhruvdutt/gitxplore-native-app"
								>
									Check Demo
								</Button>
							</Flex>

							<Flex flexDirection="column" justifyContent="center" alignItems="center">
								<a target="_blank" rel="noopener noreferrer" href="https://snack.expo.io/@dhruvdutt/todo" className="demo">
									<img width="240" src="images/native/todo.png" alt="Demo app" />
								</a>
								<Button
									rel="noopener noreferrer"
									style={{ width: 140, marginTop: 0, marginBottom: 50 }}
									shadow
									className={button}
									href="https://snack.expo.io/@dhruvdutt/todo"
								>
									Check Demo
								</Button>
							</Flex>


						</Flex>
					</Flex>
				</SlopeWrapper>

				<Flex
					flexDirection="column"
					justifyContent="center"
					alignItems="center"
					padding="3rem 3rem 4rem"
					className={tabPadding}
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
							We use Reactivesearch for powering our search at Lyearn.
							It has saved us <mark style={{ padding: '1px 4px' }}>at least a month of work.</mark>

							<footer>
								Kishan Patel, CTO,&nbsp;
								<a
									target="_blank"
									rel="noopener noreferrer"
									href="https://www.lyearn.com/"
									className={decoratedLink}
									style={{ marginTop: 0 }}
								>
									Lyearn
								</a>
							</footer>
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
							The time savings have been <mark style={{ padding: '1px 4px' }}>off the charts</mark> in getting our
							search up and running!

							<footer>
								Rob Whitley, Co-Founder,&nbsp;
								<a
									target="_blank"
									rel="noopener noreferrer"
									href="http://www.getsalespipe.com/"
									className={decoratedLink}
									style={{ marginTop: 0 }}
								>
									Salespipe
								</a>
							</footer>
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
							As someone who’s avoided React for as long as I possibly could,
							these made for an <mark style={{ padding: '1px 4px' }}>awesome</mark> (and really useful) intro, good job! 👍

							<footer>Treeasaurusrex, via Reddit</footer>
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
							The time savings have been <mark style={{ padding: '1px 4px' }}>off the charts</mark> in getting our
							search up and running!

							<footer>
								Rob Whitley, Co-Founder,&nbsp;
								<a
									target="_blank"
									rel="noopener noreferrer"
									href="http://www.getsalespipe.com/"
									className={decoratedLink}
									style={{ marginTop: 0 }}
								>
									Salespipe
								</a>
							</footer>
						</Bubble>
					</Flex>
				</Flex>

				<Flex
					backgroundColor="#fafafa"
					justifyContent="center"
					alignItems="center"
					className={tabPadding}
					style={{
						backgroundImage: 'linear-gradient(to top, rgb(223, 233, 243) 0%, white 100%)',
						paddingTop: '100px',
						paddingBottom: '60px',
					}}
				>
					<Flex
						style={{
							width: '100%',
							maxWidth: '950px',
						}}
						flexDirection="column"
						alignItems="center"
					>
						<H2
							fontWeight="700"
							fontSize="1.8rem"
							lineHeight="2.4rem"
							margin="0 0 16px 0"
							style={{
								maxWidth: 500,
								textAlign: 'center',
							}}
						>
							Hire us to build customized React and React Native apps
						</H2>
						<Text fontSize="1.2rem" lineHeight="1.5rem">
							Ship quality apps cost effectively.
						</Text>
						<div>
							<Button
								primary
								shadow
								className={button}
								href="mailto:info@appbase.io?subject=Custom+React/Native+App&body=Hi!+I+am+looking+to+build+a+custom+react+app+for+<an awesome idea>"
								target="_blank"
								rel="noopener noreferrer"
							>
								Get in touch
							</Button>
						</div>
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
							<Text light margin="3px 0"><a href="https://opensource.appbase.io/reactive-manual/native/getting-started/reactivesearch.html">Quick Start</a></Text>
							<Text light margin="3px 0"><a href="https://opensource.appbase.io/reactive-manual/native/components/textfield.html">Components</a></Text>
							<Text light margin="3px 0"><a href="https://opensource.appbase.io/reactive-manual/native/advanced/reactivecomponent.html">Create a custom component</a></Text>
							<Text light margin="3px 0"><a href="https://opensource.appbase.io/reactive-manual/">Reactivesearch for web</a></Text>
						</Flex>

						<Flex className="column" flexDirection="column">
							<Title className="heading">Community</Title>
							<Text light margin="3px 0"><a href="https://github.com/appbaseio/reactivesearch/">GitHub</a></Text>
							<Text light margin="3px 0"><a href="http://slack.appbase.io">Slack</a></Text>
							<Text light margin="3px 0"><a href="https://twitter.com/appbaseio">Twitter</a></Text>
						</Flex>

						<Flex className="column" flexDirection="column">
							<Title className="heading">Helpful Tools</Title>
							<Text light margin="3px 0"><a href="https://opensource.appbase.io/dejavu/">Data Browser</a></Text>
							<Text light margin="3px 0"><a href="https://opensource.appbase.io/mirage/">GUI Query Builder</a></Text>
						</Flex>

						<Flex className="column" flexDirection="column">
							<Title className="heading">More</Title>
							<Text light margin="3px 0"><a href="https://medium.appbase.io/">Blog</a></Text>
							<Text light margin="3px 0"><a href="http://docs.appbase.io/">Appbase.io docs</a></Text>
							<Text light margin="3px 0"><a href="https://gitter.im/appbaseio/reactivesearch">Gitter</a></Text>
							<Text light margin="3px 0"><a href="mailto:support@appbase.io">Support Email</a></Text>
						</Flex>
					</Flex>
				</Flex>
			</div>
		);
	}
}
