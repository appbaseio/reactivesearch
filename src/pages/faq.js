import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';

import { Spirit } from '../styles/spirit-styles';
import { FAQLink } from '../components/faq';
import { Layout } from '../components/common/layout';
import { getMetaImageUrls } from '../components/common/meta';

const FAQPage = () => {
	return (
		<>
			<Layout headerDividerStyle="shadow">
				<div className="bg-faq bb b--whitegrey">
					<div className={`${Spirit.page.xl} pt-vw7 pt-vw1-ns pb-vw1`}>
						<h1 className={`${Spirit.h4} white`}>Latest Updates</h1>
					</div>
				</div>
				<div className={`${Spirit.page.xl} grid-12`}>
					<div className="bg-white shadow-2 br4 mt5 mt10-ns pa5 pa15-ns pt10-ns pb12-ns col-12 col-8-ns">
						<FAQLink to="/faq/dashboard/" title="Dashboard 2.0">
							We are super excited to announce the launch of Appbase.io 2.0, the open
							core search stack for building modern apps.
						</FAQLink>

						<FAQLink
							to="/faq/reactivesearch-vue/"
							title="Vue.JS Components for building Search UIs"
						>
							Since we launched the first ReactiveSearch UI components for React in
							2017, they have been downloaded over 100,000 times and helped save
							thousands of developer hours. One of the most frequent requests we have
							received is adding support for Vue.JS.
						</FAQLink>

						<FAQLink
							to="/faq/dejavu/"
							title="Dejavu 3.0: The missing Web UI for Elasticsearch"
						>
							Dejavu 3.0 — the missing web UI for Elasticsearch is here 🎉 🎉! It’s
							been an amazing journey thus far: Since our first release in 2015, we
							have crossed a lifetime total of 475,000 Docker pulls, have over 11K
							active Chrome extension installations, and over 5,100+ stars 🌟 on our
							Github repository.
						</FAQLink>
					</div>
				</div>
			</Layout>
		</>
	);
};

FAQPage.propTypes = {
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

export default FAQPage;

export const pageQuery = graphql`
	query GhostFAQQuery {
		site {
			...SiteMetaFields
		}
	}
`;
