import React from 'react'
import PropTypes from 'prop-types'

import { Icon, Box } from '../common'

const APICard = ({ to, href, icon, img, iconClass, children }) => (
    <Box
        to={to || null}
        href={href}
        className="br4 flex flex-column justify-between items-center middarkgrey pa2 pt8 pb5 tdn"
        elevation={!href && !to ? `1` : `2`}
    >
        {icon ? <div className="w10 h10 flex justify-center items-center"><Icon name={icon} className={`w10 h10 mb4 ${iconClass}`}></Icon></div> : null}
        {img ? <div className="w10 h10 flex justify-center items-center"><img src={img} className="nudge-bottom--4" /></div> : null}
        <span className={(!to && !href ? `o-50` : ``)}>{children}</span>
    </Box>
)

APICard.propTypes = {
    to: PropTypes.string,
    href: PropTypes.string,
    icon: PropTypes.string,
    img: PropTypes.string,
    iconClass: PropTypes.string,
    children: PropTypes.node.isRequired,
}

export default APICard
