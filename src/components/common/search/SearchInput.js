import React from 'react'
import PropTypes from 'prop-types'
import Icon from '../Icon'

export const SearchInput = ({ theme, isHome, onClick }) => {
    if (isHome) {
        return (
            <div className="pa3 pa4-ns pl4 pr4 pl5-ns pr5-ns mt4 mt6-ns mb5 mb0-ns w-100 mw-s mw-100 f4 br-pill bg-white-20 shadow-3 center flex items-center justify-between">
                <Icon name="search" className="fill-white w5 w6-ns h-auto" />
                <label htmlFor="homesearch" className="clip">Search</label>
                <input
                    id="homesearch"
                    name="homesearch"
                    type="text"
                    className="input-reset form-text ba b--transparent flex-auto ml2 whitney lh-normal f4 f4-ns bg-transparent white-placeholder"
                    placeholder="Search documentation..."
                    autoComplete="off"
                    onFocus={onClick}
                    onClick={onClick}
                />
            </div>
        )
    } else if (theme) {
        return (
            <div className="relative h8 h-auto-l" onClick={onClick}>
                <Icon name="search" className={`${theme.icon} w4 h-auto absolute top-2 right-3 left-3-l`} />
                <label htmlFor="globalnavsearch" className="clip">Search</label>
                <input
                    id="globalnavsearch"
                    name="globalnavsearch"
                    type="text"
                    className={`${theme.searchBox} search-navbar-input-field f8 pa2 pl8 pr4 ba f8 fw4 br3 whitney form-text bn br-pill w-sidebar dn db-l lh-normal`}
                    placeholder="Search documentation..."
                    autoComplete="off"
                    onFocus={onClick}
                />
            </div>
        )
    }

    return null
}

SearchInput.propTypes = {
    isHome: PropTypes.bool,
    theme: PropTypes.shape({
        icon: PropTypes.string,
        searchBox: PropTypes.string,
    }),
    onClick: PropTypes.func.isRequired,
}

export default SearchInput
