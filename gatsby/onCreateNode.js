const _ = require(`lodash`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const urlUtils = require(`../utils/urls`)
const { markdownQueryConfig, defaultMarkdownSection } = require(`../utils/query-config`)
const knownSections = _.map(markdownQueryConfig, `section`)

module.exports.createMarkdownNodeFields = async ({ node, getNode, actions }) => {
    const { createNodeField } = actions

    if (node.internal.type === `MarkdownRemark`) {
        let slug = urlUtils.urlForMarkdown(node, createFilePath({ node, getNode, basePath: `pages` }))
        // Section is the first part of the path
        let section = slug.match(/^\/(.*?)\//)[1]
        section = _.includes(knownSections, section) ? section : defaultMarkdownSection

        createNodeField({
            node,
            name: `slug`,
            value: slug,
        })

        createNodeField({
            node,
            name: `section`,
            value: section,
        })
    }
}
