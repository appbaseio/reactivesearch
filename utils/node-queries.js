const defaultMarkdownFields = `
fields {
    slug
}
`;

const allMarkdownPosts = function allMarkdownposts(section, fields = defaultMarkdownFields) {
	const regex = `/^(?!/data-schema\/).*(?<!README\/)$/`; // eslint-disable-line no-useless-escape
	const sectionFilter = `section: {eq: "${section}"},`;
	const query = `
        {
            allMarkdownRemark(
                sort: {order: ASC, fields: [frontmatter___date]},
                filter: {fields: {
                    slug: {regex: "${regex}"},
                    ${section ? sectionFilter : ``}
                }}
            ) {
                edges {
                    node {
                        ${fields}
                    }
                }
            }
        }
    `;

	return query;
};

module.exports = {
	allMarkdownPosts,
};
