import React from 'react'
import PropTypes from 'prop-types'

const Icon = ({ name, className }) => {
    const IconFile = require(`../../images/icons/${name}.svg`)

    return (
        <IconFile className={className} data-cy={`${name}-icon`}/>
    )
}

Icon.propTypes = {
    name: PropTypes.string.isRequired,
    className: PropTypes.string,
}

export default Icon
