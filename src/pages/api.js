import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';

import { Spirit } from '../styles/spirit-styles';
import { Layout } from '../components/common/layout';
import { APICard } from '../components/api';

const APIPage = () => {
	const sectionStyles = {
		headingContainer: `col-12 col-4-ns mr10-ns`,
		cardContainer: `col-12 col-8-ns mt-vw4 mt0-ns grid-icon-boxes`,
	};

	return (
		<>
			<Layout mainClass="bg-whitegrey-l2" bodyClass="bg-white">
				<section className="bg-api-reference">
					<div className={`${Spirit.page.xl} tc-ns pt-vw6 pt-vw5-ns pb-vw5 white`}>
						<h1 className={`${Spirit.sectionHeading} gh-integration-header-shadow`}>
							API Reference
						</h1>
						<p className={Spirit.sectionSubHeading}>
							Clients, tools and libraries for working with Appbase
						</p>
					</div>
				</section>

				<div className={`${Spirit.page.l} pb-vw4 pb-vw3-ns pt-vw4 pt-vw3-ns`}>
					<div className="grid-12">
						<div className={sectionStyles.headingContainer}>
							<h2 id="frontend-sdk" className={`${Spirit.h3} pt20 nt20`}>
								Frontend Frameworks
							</h2>
							<p className={`${Spirit.small} midgrey-l2 mt2`}>
								Frameworks for working with the Appbase
							</p>
						</div>
						<div className={sectionStyles.cardContainer}>
							<APICard to="/api/handlebars-themes/" icon="ghostache">
								React
							</APICard>
							<APICard to="/api/gatsby/" icon="gatsby-logo">
								Vue
							</APICard>
						</div>
					</div>

					<div className="grid-12 mt-vw4 mt20-ns">
						<div className={sectionStyles.headingContainer}>
							<h2 id="rest-api" className={`${Spirit.h3} pt20 nt20`}>
								REST API
							</h2>
							<p className={`${Spirit.small} midgrey-l2 mt2`}>
								A full reference of API Endpoints
							</p>
						</div>
						<div className={sectionStyles.cardContainer}>
							<APICard to="/api/content/" icon="content-api-logo">
								Content API
							</APICard>
							<APICard to="/api/admin/" icon="admin-api-logo">
								Admin API
							</APICard>
							<APICard to="/api/webhooks/" icon="webhooks-logo">
								Webhooks
							</APICard>
						</div>
					</div>

					<div className="grid-12 mt-vw4 mt20-ns">
						<div className={sectionStyles.headingContainer}>
							<h2 id="tools" className={`${Spirit.h3} pt20 nt20`}>
								Tools
							</h2>
							<p className={`${Spirit.small} midgrey-l2 mt2`}>
								Utilities to help build and manage Ghost
							</p>
						</div>
						<div className={sectionStyles.cardContainer}>
							<APICard to="/api/ghost-cli/" icon="ghost-cli-logo">
								Ghost-CLI
							</APICard>
							<APICard to="/api/migration/" icon="migration-logo">
								Migration
							</APICard>
							<APICard href="https://gscan.ghost.org" icon="gscan-logo">
								GScan
							</APICard>
							<APICard to="/api/javascript/sdk/" icon="javascript-logo">
								JavaScript SDK
							</APICard>
						</div>
					</div>

					<div className="grid-12 mt-vw4 mt20-ns">
						<div className={sectionStyles.headingContainer}>
							<h2 id="client-libraries" className={`${Spirit.h3} pt20 nt18`}>
								Client Libraries
							</h2>
							<p className={`${Spirit.small} midgrey-l2 mt2`}>
								Specific libraries for interacting with the Ghost API directly
							</p>
							<h4 className="f-supersmall dib ma0 pa0 bg-green pa1 br-pill pl3 pr3 tc white mt2 nudge-top--2">
								Coming soon
							</h4>
						</div>
						<div className={sectionStyles.cardContainer}>
							<APICard to="/api/javascript/" icon="javascript-logo">
								JavaScript
							</APICard>
							<APICard icon="ruby-logo" iconClass="stroke-midlightgrey o-30">
								Ruby
							</APICard>
							<APICard icon="php-logo" iconClass="stroke-midlightgrey o-30">
								PHP
							</APICard>
							<APICard icon="python-logo" iconClass="stroke-midlightgrey o-30">
								Python
							</APICard>
							<APICard icon="apple-logo" iconClass="stroke-midlightgrey o-30">
								iOS
							</APICard>
							<APICard icon="android-logo" iconClass="stroke-midlightgrey o-30">
								Android
							</APICard>
						</div>
					</div>
				</div>
			</Layout>
		</>
	);
};

APIPage.propTypes = {
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

export default APIPage;

export const pageQuery = graphql`
	query {
		site {
			...SiteMetaFields
		}
	}
`;
