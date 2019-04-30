import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';

import { Spirit } from '../styles/spirit-styles';
import { FAQLink } from '../components/faq';
import { Layout } from '../components/common/layout';
import { getMetaImageUrls } from '../components/common/meta';

const FAQPage = ({ data, location }) => {
	// Add meta title and description for this page here to overwrite the site meta data as set in the config
	const title = `FAQ - Ghost`;
	const description = `Answers to our most popular questions: billing, hosting, troubleshooting and more.`;
	const imageUrl = getMetaImageUrls(`faq`);

	return (
		<>
			<Layout headerDividerStyle="shadow">
				<div className="bg-faq bb b--whitegrey">
					<div className={`${Spirit.page.xl} pt-vw7 pt-vw1-ns pb-vw1`}>
						<h1 className={`${Spirit.h4} white`}>Frequently Asked Questions</h1>
					</div>
				</div>
				<div className={`${Spirit.page.xl} grid-12`}>
					<div className="bg-white shadow-2 br4 mt5 mt10-ns pa5 pa15-ns pt10-ns pb12-ns col-12 col-8-ns">
						<FAQLink to="/faq/using-custom-domains/" title="Using custom domains">
							If you would like to make your site memorable and easy to find with a
							branded custom domain, then you can map any domain you own directly to
							your Ghost(Pro) publication.
						</FAQLink>

						<FAQLink to="/faq/forgot-password/" title="How do I reset my password?">
							In Ghost, each publication user has their own account details and
							password which can be reset or changed. Read more if you forgot your
							password or need to reset it!
						</FAQLink>

						<FAQLink to="/faq/using-the-editor/" title="Using the editor">
							Ghost has a powerful visual editor with familiar formatting options,
							with full support for dynamic content, allowing you to add images,
							galleries, videos, embeds and code!
						</FAQLink>

						<FAQLink to="/faq/publishing-options/" title="Publishing options">
							The post settings menu within the editor allows you to fully optimise
							your content. This is where you can add tags and authors, feature a
							post, or turn a post into a page.
						</FAQLink>

						<FAQLink to="/faq/managing-your-team/" title="Managing your team">
							Ghost has a number of different user roles and permissions for your team
							for effective collaboration and publication management. Read more more
							about inviting your team to Ghost!
						</FAQLink>

						<FAQLink to="/faq/the-importer/" title="Imports & exports">
							Publishing with Ghost gives you full ownership and access to your
							content and data, with sensible JSON imports and exports available at
							any time. Find out more about imports and migrations!
						</FAQLink>

						<FAQLink to="/faq/design-settings/" title="Design settings">
							Adding some design touches to your Ghost publication can be done from
							the Admin page when logged in to your publication. From here you can add
							navigation and upload a custom theme.
						</FAQLink>

						<FAQLink
							to="/faq/analytics/"
							title="How can I track how many views my site is getting?"
						>
							Ghost integrates seamlessly with all 3rd party analytics tools out
							there, and it takes just a few minutes to set up using the code
							injection feature in your publication settings.
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
