import Highlight from 'vue-highlight-words';
import { styled } from '@appbaseio/vue-emotion';
import { cx, css } from 'emotion';
import types from '../../../utils/vueTypes';

import Flex from '../../../styles/Flex';

const highlightStyle = {
	fontWeight: 600,
	padding: 0,
	backgroundColor: 'transparent',
	color: 'inherit',
};

const PredictiveSuggestion = styled('span')`
	.highlight {
		background: transparent;
		color: inherit;
		font-weight: 600;
		padding: 0;
	}
`;

const SuggestionItem = {
	name: 'SuggestionItem',
	props: {
		currentValue: types.string,
		suggestion: types.any,
	},
	render() {
		const {
			label,
			value,
			title,
			description,
			image,
			isPredictiveSuggestion,
			// eslint-disable-next-line
			_suggestion_type,
			_category,
		} = this.suggestion;

		if (label) {
			// label has highest precedence
			return typeof label === 'string' ? (
				<div class="trim">
					{(
						_category
							? false
							: isPredictiveSuggestion
							  // eslint-disable-next-line
							  || !!_suggestion_type
					) ? (
							<PredictiveSuggestion innerHTML={label} />
						) : (
							<Highlight
								searchWords={_category ? [_category] : this.currentValue.split(' ')}
								textToHighlight={label}
								autoEscape
								highlightStyle={highlightStyle}
							/>
						)}
				</div>
			) : (
				label
			);
		}
		if (title || image || description) {
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
							<div class="trim">
								<Highlight
									searchWords={this.currentValue.split(' ')}
									textToHighlight={title}
									highlightStyle={highlightStyle}
									class={css({ fontSize: '1rem' })}
								/>
							</div>
						)}
						{description && (
							<div class={cx('trim', css({ marginTop: 3 }))}>
								<Highlight
									searchWords={this.currentValue.split(' ')}
									textToHighlight={description}
									highlightStyle={highlightStyle}
								/>
							</div>
						)}
					</Flex>
				</Flex>
			);
		}
		return value;
	},
};

export default SuggestionItem;
