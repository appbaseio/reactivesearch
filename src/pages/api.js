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
							<APICard to="/rest/quickstart/" icon="content-api-logo">
								Quick Start
							</APICard>
							<APICard to="/rest/abc/" icon="ghost-cli-logo">
								Command Line
							</APICard>
						</div>
					</div>

					<div className="grid-12 mt-vw4 mt20-ns">
						<div className={sectionStyles.headingContainer}>
							<h2 id="client-libraries" className={`${Spirit.h3} pt20 nt18`}>
								Client Libraries
							</h2>
							<p className={`${Spirit.small} midgrey-l2 mt2`}>
								Specific libraries for interacting with the Appbase API directly
							</p>
						</div>
						<div className={sectionStyles.cardContainer}>
							<APICard to="/javascript/quickstart" icon="javascript-logo">
								JavaScript
							</APICard>
							<APICard to="/examples/php" icon="php-logo">
								PHP
							</APICard>
							<APICard to="/examples/python" icon="python-logo">
								Python
							</APICard>
							<APICard to="/go/quickstart" icon="ruby-logo">
								Golang
							</APICard>
							<APICard icon="apple-logo" iconClass="stroke-midlightgrey o-30">
								Swift
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
