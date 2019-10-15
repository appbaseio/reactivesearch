import React from 'react';
import PropTypes from 'prop-types';
import { injectGlobal } from 'emotion';

// eslint-disable-next-line no-unused-expressions
injectGlobal` 
	.highlight-class {
			font-weight: 600;
			padding: 0;
			background-color: transparent;
			color: inherit;
	}`;

const Highlight = (props) => {
	const { textToHighlight, searchWords } = props;
	const stringToReplace = searchWords.join('|');
	return (
		<div
			dangerouslySetInnerHTML={{
				__html: textToHighlight.replace(
					new RegExp(stringToReplace, 'ig'),
					matched => `<mark class="highlight-class">${matched}</mark>`,
				),
			}}
		/>
	);
};

Highlight.propTypes = {
	searchWords: PropTypes.arrayOf(PropTypes.string),
	textToHighlight: PropTypes.string,
};

export default Highlight;
