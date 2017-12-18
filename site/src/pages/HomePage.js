import React, { Component } from "react";
import { Flex, H1, H2, Title, Button, Text } from "@appbaseio/designkit";

import { mockDataSearch, mockDataSearchFull } from "../components/mock";

function isScrolledIntoView(el) {
	const rect = el.getBoundingClientRect();
	const Ti = rect.top;
	const elemBottom = rect.bottom;

	const isVisible = Ti <= (window.innerHeight/2) && elemBottom >= 0;
	return ({ isVisible, Ti });
}

export default class HomePage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			origin: 0
		};
	}

	componentDidMount() {
		const el = document.getElementById("code");

		setTimeout(() => {
			window.scrollTo(0, 0);
		}, 100);

		window.addEventListener("scroll", () => {
			const { isVisible, Ti } = isScrolledIntoView(el);

			const L = 1880, K = 500;
			const Tc = window.innerHeight/2;
			const delta = Tc - Ti;
			const scroll = Math.min((delta * L) / K, L-K);
			console.log("scroll ", scroll)

			if (isVisible) {
				const direction = Ti > this.state.Ti ? -1 : -1;
				this.setState({
					origin: (scroll * direction),
					Ti
				});
			} else {
				this.setState({
					Ti,
					origin: 0
				})
			}
		});

		window.scrollTo(0, 0);
	}

	render() {
		return (
			<div>
				<Flex
					flexDirection="column"
					alignItems="center"
					padding="5rem"
					style={{
						backgroundImage: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
					}}
					className="zz-border"
				>
					<H1
						fontWeight="700"
						fontSize="2rem"
						lineHeight="2.4rem"
						margin="40px 0 10px"
						style={{
							letterSpacing: "0.04rem",
							wordSpacing: "0.15rem",
							color: "#fff"
						}}
					>React UI components for Elasticsearch</H1>

					<Text
						fontSize="1rem"
						lineHeight="1.4rem"
						margin="10px 0 30px"
						light
					>Reactivesearch offers blazing fast ⚡ search UI components that run on elasticsearch</Text>

					<Flex>
						<Button
							primary
							shadow
							style={{
								fontSize: "1rem",
								textShadow: "0px 0px 1px rgba(255, 255, 255, 1)",
								margin: "0 10px 30px 0"
							}}
						>Documentation</Button>
						<Button
							shadow
							style={{
								fontSize: "1rem",
								textShadow: "0px 0px 1px rgba(255, 255, 255, 1)"
							}}
						>Tutorial</Button>
					</Flex>
					<Button className="github-btn" shadow href="https://github.com/appbaseio/reactivesearch" target="_blank">
						<svg version="1.1" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
							<path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path>
						</svg>
						Github
					</Button>
				</Flex>

				<Flex
					flexDirection="column"
					alignItems="center"
					padding="3rem"
					className="zz-border"
				>
					<H2 style={{ color: "#6772e5" }}>Configure your search experiences</H2>
					<Text fontSize="1rem" lineHeight="1.5rem" style={{ maxWidth: "600px" }}>
						Reactivesearch comes with a range of UI components making it easier for you to design the perfect search experience for your product.
					</Text>

					<Flex padding="30px" justifyContent="space-between" style={{ width: "100%" }} margin="0 40px 40px" flexWrap="wrap">
						<div style={{ width: "49%", height: "500px", margin: "12px 0", backgroundColor: "#eee" }}></div>
						<div style={{ width: "49%", height: "500px", margin: "12px 0", backgroundColor: "#eee" }}></div>
						<div style={{ width: "49%", height: "500px", margin: "12px 0", backgroundColor: "#eee" }}></div>
						<div style={{ width: "49%", height: "500px", margin: "12px 0", backgroundColor: "#eee" }}></div>
						<div style={{ width: "49%", height: "500px", margin: "12px 0", backgroundColor: "#eee" }}></div>
						<div style={{ width: "49%", height: "500px", margin: "12px 0", backgroundColor: "#eee" }}></div>
					</Flex>
				</Flex>

				<Flex
					flexDirection="column"
					alignItems="center"
					style={{ backgroundImage: "linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)" }}
					padding="3rem"
				>
					<H2 style={{ color: "#6772e5" }}>Why use it?</H2>

					<Flex margin="3rem 0" justifyContent="space-between" style={{ width: "100%" }}>
						<Flex
							style={{
								width: "19%",
								borderRadius: "0.15rem"
							}}
							flexDirection="column"
							alignItems="center"
							justifyContent="center"
							padding="1rem"
							backgroundColor="#fff"
							boxShadow="0 15px 35px rgba(50,50,93,.1), 0 5px 15px rgba(0,0,0,.07)"
						>
							<Title margin="0" fontWeight="700" fontSize="1rem">Style as per your taste</Title>
							<Text margin="12px 0 0">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</Text>
						</Flex>

						<Flex
							style={{
								width: "19%",
								borderRadius: "0.15rem"
							}}
							flexDirection="column"
							alignItems="center"
							justifyContent="center"
							padding="1rem"
							backgroundColor="#fff"
							boxShadow="0 15px 35px rgba(50,50,93,.1), 0 5px 15px rgba(0,0,0,.07)"
						>
							<Title margin="0" fontWeight="700" fontSize="1rem">Customizable queries</Title>
							<Text margin="12px 0 0">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</Text>
						</Flex>

						<Flex
							style={{
								width: "19%",
								borderRadius: "0.15rem"
							}}
							flexDirection="column"
							alignItems="center"
							justifyContent="center"
							padding="1rem"
							backgroundColor="#fff"
							boxShadow="0 15px 35px rgba(50,50,93,.1), 0 5px 15px rgba(0,0,0,.07)"
						>
							<Title margin="0" fontWeight="700" fontSize="1rem">Completely Opensource</Title>
							<Text margin="12px 0 0">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</Text>
						</Flex>

						<Flex
							style={{
								width: "19%",
								borderRadius: "0.15rem"
							}}
							flexDirection="column"
							alignItems="center"
							justifyContent="center"
							padding="1rem"
							backgroundColor="#fff"
							boxShadow="0 15px 35px rgba(50,50,93,.1), 0 5px 15px rgba(0,0,0,.07)"
						>
							<Title margin="0" fontWeight="700" fontSize="1rem">Works with any elasticsearch cluster</Title>
							<Text margin="12px 0 0">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</Text>
						</Flex>

						<Flex
							style={{
								width: "19%",
								borderRadius: "0.15rem"
							}}
							flexDirection="column"
							alignItems="center"
							justifyContent="center"
							padding="1rem"
							backgroundColor="#fff"
							boxShadow="0 15px 35px rgba(50,50,93,.1), 0 5px 15px rgba(0,0,0,.07)"
						>
							<Title margin="0" fontWeight="700" fontSize="1rem">Offers 30+ components</Title>
							<Text margin="12px 0 0">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</Text>
						</Flex>
					</Flex>
				</Flex>

				<Flex
					flexDirection="column"
					alignItems="center"
					backgroundColor="#fafafa"
					padding="3rem"
					className="zz-border"
				>
					<H2 style={{ color: "#6772e5" }}>Less code. Fewer edge cases.</H2>

					<Text fontSize="1rem" lineHeight="1.5rem" style={{ maxWidth: "600px" }}>We've done the hard work, so you don't have to. Save development time and cost. Focus on your business, and shine bright like a diamond</Text>

					<Flex padding="30px 30px 0" justifyContent="center" margin="12px 0 10px" style={{ width: "100%", textAlign: "left" }}>
						<div style={{ width: "30%" }}>
							<p className="title">Without Reactivesearch</p>
						</div>

						<div style={{ width: "30%" }}>
							<p className="title title--green">With Reactivesearch</p>
						</div>
					</Flex>
					<Flex padding="0 30px" justifyContent="center" style={{ width: "100%", textAlign: "left" }}>
						<div id="code" style={{ width: "30%", height: "500px", margin: "0", overflowY: "hidden" }}>
							<div
								style={{
									transform: `translateY(${this.state.origin > 5 ? 5 : this.state.origin}px)`,
									transition: "all .3s ease-out", willChange: "transform"
								}}
								dangerouslySetInnerHTML={{ __html: mockDataSearchFull }}
							/>
						</div>
						<div style={{ width: "30%", height: "400px", margin: "0" }}>
							<div dangerouslySetInnerHTML={{ __html: mockDataSearch }} />
						</div>
					</Flex>
				</Flex>

				<Flex
					flexDirection="column"
					alignItems="center"
				>
					<Text style={{ position: "relative", top: "50px" }}>powered by</Text>
					<a className="logo" href="https://appbase.io" target="_blank" rel="noopener noreferrer">
						<svg viewBox="0 0 500 120">
							<symbol id="s-text">
								<text textAnchor="middle" x="50%" y="50%" dy=".35em">appbase.io</text>
							</symbol>
							<use className="text" xlinkHref="#s-text"></use>
							<use className="text" xlinkHref="#s-text"></use>
							<use className="text" xlinkHref="#s-text"></use>
							<use className="text" xlinkHref="#s-text"></use>
							<use className="text" xlinkHref="#s-text"></use>
						</svg>
					</a>
				</Flex>
			</div>
		);
	}
}
