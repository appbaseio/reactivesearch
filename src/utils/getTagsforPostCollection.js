import PropTypes from 'prop-types'
import _ from 'lodash'

/* getTagsforPostCollection
* Takes a Ghost post object and a link prefix and returns the used tags
* array for a passed post collection. The tags will not contain internal tags,
* duplicates, and are sorted ascending by name. The tags array can be used to
* programmatically generate a tags cloud or menu.
*/
export const getTagsforPostCollection = function getTagsforPostCollection(posts, linkPrefix) {
    let tags = []
    // remove any added `/`, as we add them later again
    linkPrefix = /^(?:\/?)([a-zA-Z\d-]*)(?:\/?)/i.exec(linkPrefix)[1]

    tags = _.flattenDeep(tags)

    _.map(tags, (tag) => {
        tag.link = linkPrefix ? `/${linkPrefix}/${tag.slug}/` : `/${tag.slug}/`
    })

    return _.sortedUniqBy(_.sortBy(_.flattenDeep(tags), `name`), `name`)
}

getTagsforPostCollection.proptypes = {
    posts: PropTypes.arrayOf(
        PropTypes.shape({
            node: PropTypes.shape({
                tags: PropTypes.arrayOf(
                    PropTypes.shape({
                        name: PropTypes.string.isRequired,
                        slug: PropTypes.string.isRequired,
                    })
                ).isRequired,
            }).isRequired,
        })).isRequired,
    linkPrefix: PropTypes.string,
}
