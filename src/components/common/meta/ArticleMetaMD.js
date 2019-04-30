import React from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import _ from 'lodash';

import ImageMeta from './ImageMeta';
import { getMetaImageUrls } from '.';

const ArticleMetaMD = ({ data, canonical }) => {
	const post = data.markdownRemark;
	const fm = post.frontmatter;
	const { siteMetadata } = data.site;

	// Convert the frontmatter date into ISO String but, and use a fixed
	// date, if no date is set. The published date should not change once set.
	const publishedAtISODate = fm.date
		? new Date(fm.date).toISOString()
		: new Date(`2018-10-15`).toISOString();
	const primaryTag = fm.keywords && fm.keywords.length ? fm.keywords[0] : null;
	const seoImage = getMetaImageUrls();

	return (
		<>
			<Helmet>
				<title>{fm.meta_title || fm.title}</title>
				<meta name="description" content={fm.meta_description || post.excerpt} />
				<link rel="canonical" href={canonical} />

				<meta property="og:site_name" content={siteMetadata.title} />
				<meta name="og:type" content="article" />
				<meta name="og:title" content={fm.meta_title || fm.title} />
				<meta name="og:description" content={fm.meta_description || post.excerpt} />
				<meta property="og:url" content={canonical} />
				<meta property="article:published_time" content={publishedAtISODate} />
				{fm.keywords && fm.keywords.length
					? fm.keywords.map((keyword, i) => (
							<meta property="article:tag" content={keyword} key={i} />
					  ))
					: null}

				<meta name="twitter:title" content={fm.meta_title || fm.title} />
				<meta name="twitter:description" content={fm.meta_description || post.excerpt} />
				<meta name="twitter:url" content={canonical} />
				<meta name="twitter.label1" content="Reading time" />
				<meta name="twitter:data1" content={`${post.timeToRead} min read`} />
				{primaryTag ? <meta name="twitter:label2" content="Filed under" /> : null}
				{primaryTag ? <meta name="twitter:data2" content={primaryTag} /> : null}
				<meta name="twitter:site" content="@appbaseio" />
				<meta name="twitter:creator" content="@appbaseio" />
				<script type="application/ld+json">
					{`
                    {
                        "@context": "https://schema.org/",
                        "@type": "Article",
                        "author": {
                            "@type": "Person",
                            "name": "Appbase",
                            "sameAs": [
                                "https://appbase.io/",
                                "https://twitter.com/appbaseio/"
                            ]
                        },
                        ${
							fm.keywords && fm.keywords.length
								? `"keywords": "${_.join(fm.keywords, `, `)}",`
								: ``
						}
                        "headline": "${fm.meta_title || fm.title}",
                        "url": "${canonical}",
                        "datePublished": "${publishedAtISODate}",
                        "image": {
                            "@type": "ImageObject",
                            "url": "${seoImage}",
                            "width": 1000,
                            "height": 563
                        },
                        "description": "${fm.meta_description || post.excerpt}",
                        "mainEntityOfPage": {
                            "@type": "WebPage",
                            "@id": "${siteMetadata.siteUrl}"
                        }
                    }
                `}
				</script>
			</Helmet>
			<ImageMeta image={seoImage} />
		</>
	);
};

ArticleMetaMD.propTypes = {
	data: PropTypes.shape({
		markdownRemark: PropTypes.shape({
			frontmatter: PropTypes.shape({
				title: PropTypes.string.isRequired,
				keywords: PropTypes.arrayOf(PropTypes.string),
				meta_title: PropTypes.string,
				meta_description: PropTypes.string,
				date: PropTypes.string,
			}).isRequired,
			excerpt: PropTypes.string.isRequired,
			timeToRead: PropTypes.number,
		}).isRequired,
		site: PropTypes.shape({
			siteMetadata: PropTypes.shape({
				siteUrl: PropTypes.string.isRequired,
				title: PropTypes.string.isRequired,
				description: PropTypes.string.isRequired,
			}).isRequired,
		}).isRequired,
	}).isRequired,
	canonical: PropTypes.string.isRequired,
};

export default ArticleMetaMD;
