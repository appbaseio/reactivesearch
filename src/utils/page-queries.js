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
			meta_title
			meta_description
			sidebar
			nestedSidebar
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
