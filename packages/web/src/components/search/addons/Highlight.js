import React from 'react';
import PropTypes from 'prop-types';

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
