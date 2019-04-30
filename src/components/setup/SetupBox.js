import React from 'react'
import PropTypes from 'prop-types'

import { Box, Icon } from '../common'
import { Spirit } from '../../styles/spirit-styles'

const SetupBox = ({ to, href, icon, iconClass, headingClass, title, children }) => (
    <Box
        to={to}
        href={href}
        className="col-12 col-6-ns col-4-l pa8 tdn middarkgrey setup-box-min-height"
        radius="4"
    >
        <Icon name={icon} className={iconClass} />
        <h4 className={`${Spirit.h4} darkgrey ${headingClass}`}>{title}</h4>
        <div className={`${Spirit.small} mt1 midgrey`}>{children}</div>
    </Box>
)

SetupBox.propTypes = {
    children: PropTypes.node.isRequired,
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    to: PropTypes.string,
    href: PropTypes.string,
    iconClass: PropTypes.string,
    headingClass: PropTypes.string,
}

export default SetupBox
