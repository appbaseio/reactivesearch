import React from 'react'
import PropTypes from 'prop-types'

import { Box } from '../common'
import { Spirit } from '../../styles/spirit-styles'

const TutorialCard = ({ post, className, section }) => {
    const url = `/${section}/${post.slug}/`
    const excerpt = post.excerpt.length > 200 ? `${post.excerpt.substring(0, 200)}...` : post.excerpt

    return (
        <Box
            to={url}
            className={`${className} pa10 pa8 flex flex-column justify-between flex-third relative tutorial-post-card tdn`}
            elevation="1"
        >
            <div>
                <header>
                    <h2 className={`${Spirit.h3} darkgrey nt2`}>{post.title}</h2>
                </header>
                <section className={`${Spirit.p} midgrey mt4`}>{excerpt}</section>
            </div>
            <footer className="pt2 mt6 flex justify-between items-center">
                <div className="flex items-center">
                    {post.featured ? <span className="bg-tutorial-color pa1 f-supersmall fw5 dib measure-0-2 mr2 white br2 pl3 pr3">Featured</span> : null}

                </div>
            </footer>
        </Box>
    )
}

TutorialCard.propTypes = {
    post: PropTypes.shape({
        title: PropTypes.string.isRequired,
        featured: PropTypes.bool,
        tags: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string,
            })
        ),
        excerpt: PropTypes.string.isRequired,
    }).isRequired,
    className: PropTypes.string,
    section: PropTypes.string.isRequired,
}

export default TutorialCard
