import React from 'react';
import { css, cx } from 'react-emotion';

import Flex from '../../../styles/Flex';
import Highlight from './Highlight';

const SuggestionItem = ({ currentValue, suggestion }) => {
	const {
		label, value, title, description, image,
	} = suggestion;
	if (label) {
		// label has highest precedence
		return typeof label === 'string' ? (
			<div className="trim">
				<Highlight searchWords={currentValue.split(' ')} textToHighlight={label} />
			</div>
		) : (
			label
		);
	} else if (title || image || description) {
		return (
			<Flex alignItems="center" css={{ width: '100%' }}>
				{image && (
					<div css={{ margin: 'auto', marginRight: 10 }}>
						<img
							src={image}
							alt=" "
							height="50px"
							width="50px"
							css={{ objectFit: 'contain' }}
						/>
					</div>
				)}
				<Flex direction="column" css={{ width: image ? 'calc(100% - 60px)' : '100%' }}>
					{title && (
						<div className="trim">
							<Highlight
								searchWords={currentValue.split(' ')}
								textToHighlight={title}
								className={css({ fontSize: '1rem' })}
							/>
						</div>
					)}
					{description && (
						<div className={cx('trim', css({ marginTop: 3 }))}>
							<Highlight
								searchWords={currentValue.split(' ')}
								textToHighlight={description}
							/>
						</div>
					)}
				</Flex>
			</Flex>
		);
	}
	return value;
};

export default SuggestionItem;
