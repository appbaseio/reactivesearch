const _ = require(`lodash`)

// The amount of related posts that you want to show
const NUMBER_RELATED_POSTS = 5

// The minimum of tags the posts have in common
const MIN_TAGS_IN_COMMON = 2

const sortByDateDescending = (a, b) => {
    const aPublishedAt = (new Date(a.node.published_at)).getTime()
    const bPublishedAt = (new Date(b.node.published_at)).getTime()

    if (aPublishedAt > bPublishedAt) {
        return -1
    }

    if (aPublishedAt < bPublishedAt) {
        return 1
    }

    return 0
}

const getRelatedPosts = (currentPost, allPosts) => {
    let mostCommonTags = []

    const hasSameTags = ({ node }) => {
        // stop when we have the same id
        if (currentPost.slug === node.slug) {
            return false
        }

        const commonTags = _.intersectionBy(currentPost.tags, node.tags, tag => tag.slug)

        if (commonTags.length > MIN_TAGS_IN_COMMON) {
            // when we have an article with more than our 2 min tags in common
            // we store it, to sort it later by the number of tags and use this
            // order to render the related posts
            mostCommonTags.push({
                slug: node.slug,
                tags: commonTags.length,
            })
        }

        // Needs to be minimum 2 tags in common, as the internal Tag is already one
        return commonTags.length >= MIN_TAGS_IN_COMMON
    }

    // Our base articles that have min 2 tags in common
    let filteredPosts = _.filter(allPosts, hasSameTags)

    if (filteredPosts.length && mostCommonTags.length) {
        const higherRankedPosts = []

        // Sort the mostCommonTags list by the highest number
        mostCommonTags = _.sortBy(mostCommonTags, `tags`)

        // In order of our most common tag list (higher -> lower), we find the associated
        // node in our post list and set it aside for later, keeping the order.
        _.forEach(mostCommonTags, (tagList) => {
            higherRankedPosts.push(_.find(filteredPosts, ({ node }) => node.slug === tagList.slug))
        })

        // Remove the nodes, that we set aside
        filteredPosts = _.difference(filteredPosts, higherRankedPosts)

        // We return the concatinated list of posts, but put our higher ranked posts first, then
        // the regular filtered posts, which we order by date

        filteredPosts = _.concat(higherRankedPosts, filteredPosts.sort(sortByDateDescending)).slice(0, NUMBER_RELATED_POSTS)
    } else if (filteredPosts.length) {
        // We didn't have more than 2 tags in common, the result will only be sorted by date
        if (filteredPosts.length > NUMBER_RELATED_POSTS) {
            filteredPosts = filteredPosts.sort(sortByDateDescending).slice(0, NUMBER_RELATED_POSTS)
        } else if (filteredPosts.length > 1) {
            filteredPosts = filteredPosts.sort(sortByDateDescending)
        }
    }

    // if we didn't reach the minimum number of related posts, we randomly pick some until we do
    if (filteredPosts.length < NUMBER_RELATED_POSTS) {
        let missingPostsNumber = NUMBER_RELATED_POSTS - filteredPosts.length
        // Only check the posts that are not used yet and remove our current post as well
        allPosts = _.filter(allPosts, ({ node }) => node.slug !== currentPost.slug)
        const allPostsAvailable = _.difference(allPosts, filteredPosts)

        const randomPosts = []

        while (missingPostsNumber > 0 && allPostsAvailable.length) {
            const randomPostNumber = Math.floor(Math.random() * (allPostsAvailable.length + 1))
            const [randomPost] = allPostsAvailable.splice(randomPostNumber, 1)

            if (randomPost) {
                randomPosts.push(randomPost)

                missingPostsNumber -= 1
            }
        }

        return _.concat(filteredPosts, randomPosts)
    } else {
        return filteredPosts
    }
}

module.exports = getRelatedPosts
