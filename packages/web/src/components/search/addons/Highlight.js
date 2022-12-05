/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import PropTypes from 'prop-types';

import { escapeRegExp } from '../../../utils';

const highlightedStyling = css`
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	.highlight {
		font-weight: 600;
		padding: 0;
		background-color: transparent;
		color: inherit;
	}
`;

const Highlight = (props) => {
	const {
		textToHighlight, searchWords, autoEscape, hasPredictiveSuggestion, categoryLabel,
	}
		= props;
	const modSearchWords = searchWords
		.map(word => (autoEscape ? escapeRegExp(word) : word))
		.filter(word => word);
	const stringToReplace = categoryLabel || modSearchWords.join('|');
	return (
		<div
			css={highlightedStyling}
			dangerouslySetInnerHTML={{
				__html: hasPredictiveSuggestion
					? textToHighlight
					: textToHighlight.replace(
						new RegExp(stringToReplace, 'ig'),
						matched => `<mark class="highlight">${matched}</mark>`,
					  ),
			}}
		/>
	);
};

Highlight.propTypes = {
	searchWords: PropTypes.arrayOf(PropTypes.string),
	textToHighlight: PropTypes.string,
	autoEscape: PropTypes.bool,
	hasPredictiveSuggestion: PropTypes.bool,
	categoryLabel: PropTypes.string,
};

Highlight.defaultProps = {
	searchWords: [],
	textToHighlight: '',
	autoEscape: false,
	hasPredictiveSuggestion: false,
};

export default Highlight;
