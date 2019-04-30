import React from 'react'
import PropTypes from 'prop-types'

import NavBar from '../NavBar'

const headerShadow = {
    hairline: `bb b--whitegrey`,
    shadow: `header-shadow`,
    none: ``,
}

const Header = ({ dividerStyle }) => (
        <>
            <header className={`${headerShadow[dividerStyle]} fixed bg-white top-0 left-0 right-0 z-500 mb10`}>
                <NavBar theme="dark" />
            </header>
            <div className="h17"></div> {/* We need to push down all the content because of the fixed header */}
        </>
)

Header.defaultProps = {
    dividerStyle: `hairline`,
}

Header.propTypes = {
    dividerStyle: PropTypes.oneOf([`hairline`, `shadow`, `none`]),
}

export default Header
