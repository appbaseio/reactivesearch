import React from 'react';
import { Link, graphql } from 'gatsby';

import PropTypes from 'prop-types';

import { Icon, Box } from '../components/common';
import { Layout } from '../components/common/layout';
import { HomeHeader, HomeAPIBox, HomeFAQLink } from '../components/home';
import { Spirit } from '../styles/spirit-styles';

const HomePage = ({ data, location }) => {
	// Add meta title and description for this page here to overwrite the site meta data as set in the config

	return (
		<>
			<Layout
				headerDividerStyle="shadow"
				bodyClass="bg-white"
				mainClass="bg-whitegrey-l2 pb-vw6 pb-vw3-ns"
				header={<HomeHeader />}
			>
				<div className="pt-vw3 home-main-box-padding-ns">
					<div className={`${Spirit.page.xl} grid-12 gutter-row-20 gutter-40-ns`}>
						<section className="col-12 col-6-ns flex flex-column justify-between mt4 mt0-ns">
							<Link
								to="/api/"
								className={`${Spirit.h3} link darkgrey hover-midgrey flex-grow-0`}
							>
								API Reference
							</Link>

							<Box
								className="mt5 tdn flex-auto flex flex-column items-stretch"
								elevation="1"
							>
								<HomeAPIBox
									to="/javascript/quickstart"
									title="Javascript Quick Start"
									icon="sdks"
								>
									Quick start with the JavaScript APIs for indexing, querying and
									streaming data.
								</HomeAPIBox>
								<HomeAPIBox
									to="/rest/quickstart"
									title="Rest API Quick Start"
									icon="rest-api"
								>
									Get started with the REST APIs for indexing, querying and
									streaming data.
								</HomeAPIBox>
								<HomeAPIBox to="/go/quickstart" title="GO QuickStart" icon="tools">
									Quick start with the Go APIs for indexing, querying and
									streaming data.
								</HomeAPIBox>
							</Box>
						</section>

						<section className="col-12 col-6-ns mt0-ns bt bn-ns b--whitegrey nl5 nr5 nl0-ns nr0-ns ml0-ns mr0-ns pl5 pr5 pl0-ns pr0-ns pt5 pt0-ns ">
							<Link to="/faq/" className={`${Spirit.h3} link darkgrey hover-midgrey`}>
								Latest Releases
							</Link>
							<div className="mt3 mt7-ns">
								<HomeFAQLink to="/faq/upgrade-to-ghost-2-0/" title="Dashboard 2.0">
									We are super excited to announce the launch of Appbase.io 2.0,
									the open core search stack for building modern apps.
								</HomeFAQLink>

								<HomeFAQLink
									to="/faq/reactivesearch-vue/"
									title="Vue.JS Components for building Search UIs"
								>
									Since we launched the first ReactiveSearch UI components for
									React in 2017, they have been downloaded over 100,000 times and
									helped save thousands of developer hours. One of the most
									frequent requests we have received is adding support for Vue.JS.
								</HomeFAQLink>

								<HomeFAQLink
									to="/faq/dejavu/"
									title="Dejavu 3.0: The missing Web UI for Elasticsearch"
								>
									It’s been an amazing journey thus far: Since our first release
									in 2015, we have crossed a lifetime total of 475,000 Docker
									pulls, have over 11K active Chrome extension installations, and
									over 5,100+ stars 🌟 on our Github repository.
								</HomeFAQLink>

								<Link
									to="/faq/"
									className={`${Spirit.p} midgrey fw5 link hover-blue`}
								>
									More updates...
								</Link>
							</div>
						</section>
					</div>

					<section
						className={`${
							Spirit.page.xl
						} col-12 mt8 mt-vw3-ns bt bn-ns b--whitegrey pt5 pt0-ns`}
					>
						<Link
							to="/integrations/"
							className={`${Spirit.h3} link darkgrey hover-midgrey`}
						>
							Integrations
						</Link>
						<p
							className={`${
								Spirit.p
							} mt2 midgrey flex flex-column flex-row-ns justify-between items-center-ns`}
						>
							All libraries and tools, integrated with Appbase.
							<Link
								to="/integrations/"
								className="blue link din nb1 mt2 mt0-ns hover-underline-blue"
							>
								<span className="flex items-center fw5">
									Browse all integrations{' '}
									<Icon name="arrow-right" className="w3 h3 ml1 fill-blue" />
								</span>
							</Link>
						</p>
						<div className="grid-integrations-index mt4 mt6-l f8">
							<Box
								to="/reactivesearch/overview/quickstart/"
								className="flex flex-column justify-between items-center middarkgrey pa2 pt5 pb5 tdn tc"
								elevation="2"
								radius="4"
							>
								<img
									className="w10 mb1"
									src="data:image/png;base64,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"
									alt="React"
								/>
								React
							</Box>
							<Box
								to="/integrations/disqus/"
								className="flex flex-column justify-between items-center middarkgrey pa2 pt5 pb5 tdn tc"
								elevation="2"
								radius="4"
							>
								<img
									className="w10 mb1"
									src="https://vuejs.org/images/logo.png"
									alt="Disqus"
								/>
								Vue
							</Box>
							<Box
								to="/integrations/slack/"
								className="flex flex-column justify-between items-center middarkgrey pa2 pt5 pb5 tdn tc"
								elevation="2"
								radius="4"
							>
								<img
									className="w10 mb1"
									src="data:image/png;base64,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"
									alt="React Native"
								/>
								React Native
							</Box>
							<Box
								to="/integrations/unsplash/"
								className="flex flex-column justify-between items-center middarkgrey pa2 pt5 pb5 tdn tc"
								elevation="2"
								radius="4"
							>
								<img
									className="w10 mb1"
									src="https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png"
									alt="Javascript"
								/>
								Javascript
							</Box>
							<Box
								to="/integrations/google-analytics/"
								className="flex flex-column justify-between items-center middarkgrey pa2 pt5 pb5 tdn tc"
								elevation="2"
								radius="4"
							>
								<img
									className="w10 mb1"
									src="https://arc-site.netlify.com/static/svg/navbar/ClusterEdition.svg"
									alt="Google Analytics"
								/>
								Clusters
							</Box>
							<Box
								to="/integrations/mailchimp/"
								className="flex flex-column justify-between items-center middarkgrey pa2 pt5 pb5 tdn tc"
								elevation="2"
								radius="4"
							>
								<img
									className="w10 mb1"
									src="https://miro.medium.com/max/790/1*uHzooF1EtgcKn9_XiSST4w.png"
									alt="REST APi"
								/>
								REST API
							</Box>
							<Box
								to="/integrations/google-amp/"
								className="flex flex-column justify-between items-center middarkgrey pa2 pt5 pb5 tdn tc"
								elevation="2"
								radius="4"
							>
								<img
									className="w10 mb1"
									src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Swift_logo.svg/1138px-Swift_logo.svg.png"
									alt="Swift"
								/>
								Swift
							</Box>
							<Box
								to="/integrations/"
								className="flex flex-column justify-between items-center middarkgrey pa2 pt5 pb5 tdn"
								elevation="2"
								radius="4"
							>
								<Icon name="more" className="w8 nudge-top--6" />
								See More
							</Box>
						</div>
					</section>
				</div>
			</Layout>
		</>
	);
};

HomePage.propTypes = {
	data: PropTypes.shape({
		site: PropTypes.shape({
			siteMetadata: PropTypes.shape({
				siteUrl: PropTypes.string.isRequired,
				title: PropTypes.string.isRequired,
				description: PropTypes.string.isRequired,
			}).isRequired,
		}).isRequired,
	}).isRequired,
	location: PropTypes.shape({
		pathname: PropTypes.string.isRequired,
	}).isRequired,
};

export default HomePage;

export const pageQuery = graphql`
	query {
		site {
			...SiteMetaFields
		}
	}
`;
