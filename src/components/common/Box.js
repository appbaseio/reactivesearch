import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'

const Box = ({ children, to, href, className, elevation, radius, onWhite }) => {
    // Make sure the passed values are numbers and fall back to the defaults
    const elevationNum = parseInt(elevation) || parseInt(Box.defaultProps.elevation)
    const radiusNum = parseInt(radius) || parseInt(Box.defaultProps.radius)
    const baseBoxClass = `bg-white`
    // Shadow classes
    const shadowClasses = `shadow-${elevationNum} ${(href || to ? `box-shadow-hover shadow-${elevationNum}-hover` : ``)}`
    // Border radius clss
    const radiusClasses = `br${radiusNum}`

    if (to) {
        // internal links
        return (
            <Link
                to={to}
                className={`${baseBoxClass} ${shadowClasses} ${(onWhite ? `on-white` : ``)} ${radiusClasses} db ${className}`}
            >
                {children}
            </Link>
        )
    } else if (href) {
        // external links
        return (
            <a
                href={href}
                className={`${baseBoxClass} ${shadowClasses} ${(onWhite ? `on-white` : ``)} ${radiusClasses} db ${className}`}
                target="_blank"
                rel="noopener noreferrer"
            >
                {children}
            </a>
        )
    } else {
        // non-link boxes
        return (
            <div className={`${baseBoxClass} ${shadowClasses} ${radiusClasses} ${className}`}>
                {children}
            </div>
        )
    }
}

Box.defaultProps = {
    elevation: `2`,
    radius: `3`,
    onWhite: false,
}

Box.propTypes = {
    children: PropTypes.node.isRequired,
    to: PropTypes.string,
    href: PropTypes.string,
    elevation: PropTypes.string,
    radius: PropTypes.string,
    onWhite: PropTypes.bool,
    className: PropTypes.string,
}

export default Box
