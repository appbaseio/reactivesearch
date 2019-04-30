import PropTypes from 'prop-types'

export const getPostHeaderConfig = ({ pathname }) => {
    const postHeaderConfig = {
        bgClass: `bg-api-reference`,
    }

    // TODO: make this nice and DRY

    // Handlebars
    if (pathname.match(/^\/api\//i)) {
        postHeaderConfig.title = `API Reference`
        postHeaderConfig.mainLink = `/api/`
        if (pathname.match(/\/handlebars-themes\//i)) {
            postHeaderConfig.subtitle = `Handlebars Themes`
            postHeaderConfig.subLink = `/api/handlebars-themes/`
        }
        if (pathname.match(/\/gatsby\//i)) {
            postHeaderConfig.subtitle = `Gatsby`
            postHeaderConfig.subLink = `/api/gatsby/`
        }
        if (pathname.match(/\/content\//i)) {
            postHeaderConfig.subtitle = `Content`
            postHeaderConfig.subLink = `/api/content/`
        }
        if (pathname.match(/\/admin\//i)) {
            postHeaderConfig.subtitle = `Admin`
            postHeaderConfig.subLink = `/api/admin/`
        }
        if (pathname.match(/\/webhooks\//i)) {
            postHeaderConfig.subtitle = `Webhooks`
            postHeaderConfig.subLink = `/api/webhooks/`
        }
        if (pathname.match(/\/ghost-cli\//i)) {
            postHeaderConfig.subtitle = `Ghost CLI`
            postHeaderConfig.subLink = `/api/ghost-cli/`
        }
    }

    // Setup
    if (pathname.match(/^\/setup\//i) || pathname.match(/^\/install\//i)) {
        postHeaderConfig.title = `Setup Guide`
        postHeaderConfig.mainLink = `/setup/`
        postHeaderConfig.bgClass = `bg-setup`
        if (pathname.match(/\/ghost-pro\//i)) {
            postHeaderConfig.subtitle = `Ghost(Pro)`
            postHeaderConfig.subLink = `/setup/ghost-pro/`
        }
        if (pathname.match(/\/ubuntu\//i)) {
            postHeaderConfig.subtitle = `Ubuntu`
            postHeaderConfig.subLink = `/install/ubuntu/`
        }
        if (pathname.match(/\/docker\//i)) {
            postHeaderConfig.subtitle = `Docker`
            postHeaderConfig.subLink = `/install/docker/`
        }
        if (pathname.match(/\/local\//i)) {
            postHeaderConfig.subtitle = `Local`
            postHeaderConfig.subLink = `/install/local/`
        }
        if (pathname.match(/\/source\//i)) {
            postHeaderConfig.subtitle = `From Source`
            postHeaderConfig.subLink = `/install/source/`
        }
    }

    // Core Concepts
    if (pathname.match(/^\/concepts\//i)) {
        postHeaderConfig.title = `Core Concepts`
        postHeaderConfig.mainLink = `/concepts/introduction/`
        postHeaderConfig.bgClass = `bg-concepts`
    }

    return postHeaderConfig
}

getPostHeaderConfig.proptypes = {
    pathname: PropTypes.string.isRequired,
}

export default getPostHeaderConfig
