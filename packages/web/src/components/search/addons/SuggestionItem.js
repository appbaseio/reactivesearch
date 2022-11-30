/** @jsxImportSource @emotion/react */



import Flex from '../../../styles/Flex';
import Highlight from './Highlight';

const SuggestionItem = ({ currentValue = '', suggestion }) => {
	const {
		label, value, title, description, image, isPredictiveSuggestion,
	} = suggestion;

	if (label) {
		// label has highest precedence
		return typeof label === 'string' ? (
			<div className="trim">
				<Highlight
					categoryLabel={suggestion._category ? `in ${suggestion._category}` : ''}
					autoEscape
					searchWords={currentValue.split(' ')}
					textToHighlight={label}
					hasPredictiveSuggestion={
						suggestion._category
							? false
							: Boolean(isPredictiveSuggestion) || !!suggestion._suggestion_type
					}
				/>
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
								css={{ fontSize: '1rem' }}
							/>
						</div>
					)}
					{description && (
						<div className="trim" css={{ marginTop: 3 }}>
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
