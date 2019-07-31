import { graphql } from 'gatsby';

export const siteMetaFields = graphql`
	fragment SiteMetaFields on Site {
		siteMetadata {
			siteUrl
			title
			description
		}
	}
`;

export const markdownFields = graphql`
	fragment MarkdownFields on MarkdownRemark {
		frontmatter {
			title
			date
			date_pretty: date(formatString: "DD MMMM, YYYY")
			path
			meta_title
			meta_description
			image
			next {
				url
				title
				description
			}
			sidebar
			nestedSidebar
			toc
			keywords
		}
		html
		fields {
			slug
		}
		timeToRead
		excerpt
		fileAbsolutePath
	}
`;
