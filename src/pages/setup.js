import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';

import { Spirit } from '../styles/spirit-styles';
import { Layout } from '../components/common/layout';
import { SetupBox } from '../components/setup';

const SetupPage = () => {
	return (
		<>
			<Layout mainClass="bg-whitegrey-l2 pb-vw3" bodyClass="bg-white">
				<section className="bg-setup">
					<div className={`${Spirit.page.xl} tc-ns pt-vw6 pt-vw5-ns pb-vw5 white`}>
						<h1 className={`${Spirit.sectionHeading} gh-integration-header-shadow`}>
							Setup Guide
						</h1>
						<p className={Spirit.sectionSubHeading}>
							The easiest way to get started is to use <strong>Ghost(Pro)</strong>. If
							you prefer to self-host, we strongly recommend an Ubuntu server with at
							least 1GB of memory to run Ghost.
						</p>
					</div>
				</section>

				<div className={`${Spirit.page.xl} mt-vw3`}>
					<section className="grid-12 gutter-row-20 gutter-20-ns gutter-36-l">
						<SetupBox
							href="https://ghost.org/pricing/"
							title="Ghost(Pro)"
							icon="ghost-pro-logo"
							iconClass="w9 h9"
							headingClass="mt2"
						>
							<strong>Fully managed PaaS</strong> with 1-click deployment, worldwide
							CDN, backups, upgrades & security
						</SetupBox>

						<SetupBox
							to="/install/ubuntu/"
							title="Ubuntu"
							icon="ubuntu-logo"
							iconClass="w8 h8"
							headingClass="mt2"
						>
							<p className={`${Spirit.small} mw70`}>
								A full guide for installing Ghost on Ubuntu{' '}
								<strong>16.04 LTS</strong> and <strong>18.04 LTS</strong>{' '}
								<em>(Recommended)</em>
							</p>
						</SetupBox>

						<SetupBox
							href="https://hub.docker.com/_/ghost/"
							title="Docker"
							icon="docker-logo"
							iconClass="w10 h10"
							headingClass="mt1"
						>
							<p className={`${Spirit.small} mw70`}>
								<strong>Unofficial community package</strong> for running Ghost
								inside a Docker container
							</p>
						</SetupBox>

						<SetupBox
							to="/install/local/"
							title="Local install"
							icon="terminal"
							iconClass="fill-midlightgrey w8 h8"
							headingClass="mt2"
						>
							<p className={`${Spirit.small} mw70`}>
								<strong>Fast-track</strong> local install for running Ghost on your
								computer or doing theme development
							</p>
						</SetupBox>

						<SetupBox
							to="/install/source/"
							title="Install from Source"
							icon="github-outline"
							iconClass="fill-darkgrey w8 h8"
							headingClass="mt2"
						>
							<p className={`${Spirit.small} mw70`}>
								<strong>Advanced developer guide</strong> for working directly on
								Ghost Core and Ghost Admin
							</p>
						</SetupBox>
					</section>
				</div>
			</Layout>
		</>
	);
};

SetupPage.propTypes = {
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

export default SetupPage;

export const pageQuery = graphql`
	query {
		site {
			...SiteMetaFields
		}
	}
`;
