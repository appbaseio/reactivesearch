import React from 'react'
import PropTypes from 'prop-types'

import { Spirit } from '../../styles/spirit-styles'

const FeedbackForm = ({ location }) => {
    const formTarget = `https://teamghost.typeform.com/to/NcHfDI?page=` + location.href

    return (
        <div className="external-scripts relative mw-content center pa5 pa15-ns pt10-ns bg-white shadow-2 mt5 mt10-ns br4">
            <h4 className={`${Spirit.h4} mt1 nudge-top--2`}>Hey! 👋 Was this page helpful?</h4>
            <div className="mt2 flex items-center justify-between">
                <div>
                    <p className={`${Spirit.small} ma0 midgrey`}>We&apos;re always looking to make our docs better, please let us know if you have any suggestions or advice about what&apos;s working and what&apos;s not!</p>
                </div>
                <div className="flex-shrink-0">
                    <a
                        className="typeform-share button mt3 ml7 pa3 pl7 pr7 button-blue white tdn bn whitney f8"
                        href={formTarget}
                        data-mode="popup"
                        data-hide-headers="true"
                        data-hide-footer="true"
                        data-submit-close-delay="5"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Send Feedback
                    </a>
                    <script src="https://embed.typeform.com/embed.js"></script>
                </div>
            </div>
        </div>
    )
}

FeedbackForm.propTypes = {
    location: PropTypes.shape({
        href: PropTypes.string.isRequired,
    }).isRequired,
}
export default FeedbackForm
