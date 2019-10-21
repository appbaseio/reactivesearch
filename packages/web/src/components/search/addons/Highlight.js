import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';

import { escapeRegExp } from '../../../utils';

const highlightedStyling = css`
	.highlight {
		font-weight: 600;
		padding: 0;
		background-color: transparent;
		color: inherit;
	}
`;

const Highlight = (props) => {
	const { textToHighlight, searchWords, autoEscape } = props;
	const modSearchWords = searchWords.map(word => (autoEscape ? escapeRegExp(word) : word));
	const stringToReplace = modSearchWords.join('|');
	return (
		<div
			className={highlightedStyling}
			dangerouslySetInnerHTML={{
				__html: textToHighlight.replace(
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
};

Highlight.defaultProps = {
	searchWords: [],
	textToHighlight: '',
	autoEscape: false,
};

export default Highlight;
