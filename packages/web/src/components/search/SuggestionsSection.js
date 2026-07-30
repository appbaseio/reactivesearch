import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import XSS from 'xss';
import { getClassName } from '@appbaseio/reactivecore/lib/utils/helper';
import CustomSvg from '../shared/CustomSvg';
import SuggestionItem from './addons/SuggestionItem';
import TextWithTooltip from './addons/TextWithTooltip';
import { FallbackRender } from './addons/FallbackRender';
import { Suggestion, SuggestionDescription } from '../../styles/Input';

const SuggestionsSection = ({
	showAIScreen,
	parsedSuggestions,
	indexOffset = 0,
	innerClass,
	getItemProps,
	highlightedIndex,
	renderItem,
	getIcon,
	getActionIcon,
	currentValue,
	showSuggestionsFooter,
	SuggestionsFooter,
	hasSuggestions,
	renderNoSuggestion,
}) => {
	if (showAIScreen) return null;

	const suggestionsList = parsedSuggestions();

	if (!hasSuggestions()) {
		return renderNoSuggestion(suggestionsList);
	}

	let localIndexOffset = indexOffset;

	return (
		<Fragment>
			{suggestionsList.map((item, itemIndex) => {
				const index = localIndexOffset + itemIndex;
				if (Array.isArray(item)) {
					const sectionHtml = XSS(item[0].sectionLabel);
					localIndexOffset += item.length - 1;
					return (
						<div className="section-container" key={`${item[0].sectionId}`}>
							{sectionHtml && (
								<div
									className={`section-header ${getClassName(
										innerClass,
										'section-label',
									)}`}
									dangerouslySetInnerHTML={{
										__html: sectionHtml,
									}}
								/>
							)}
							<ul className="section-list">
								{item.map((sectionItem, sectionIndex) => (
									<li
										{...getItemProps({
											item: sectionItem,
										})}
										key={`${sectionItem.sectionId + sectionIndex}-${sectionItem.value}`}
										style={{
											justifyContent: 'flex-start',
											alignItems: 'center',
										}}
										className={`${
											highlightedIndex === index + sectionIndex
												? `active-li-item ${getClassName(
														innerClass,
														'active-suggestion-item',
												  )}`
												: `li-item ${getClassName(innerClass, 'suggestion-item')}`
										}`}
									>
										<FallbackRender
											item={typeof renderItem === 'function' ? renderItem(sectionItem) : null}
										>
											<React.Fragment>
												<div
													style={{
														padding: '0 10px 0 0',
														display: 'flex',
													}}
												>
													<CustomSvg
														iconId={`${sectionIndex + index + 1}-${sectionItem.value}-icon`}
														className={
															getClassName(
																innerClass,
																`${sectionItem._suggestion_type}-search-icon`,
															) || null
														}
														icon={getIcon(sectionItem._suggestion_type, sectionItem)}
														type={`${sectionItem._suggestion_type}-search-icon`}
													/>
												</div>
												<Suggestion direction="column">
													{sectionItem.label && (
														<TextWithTooltip
															title={sectionItem.label}
															className="section-list-item__label"
															innerHTML={sectionItem.label}
														/>
													)}
													{sectionItem.description && (
														<SuggestionDescription
															lines={1}
															className="section-list-item__description"
															dangerouslySetInnerHTML={{
																__html: XSS(sectionItem.description),
															}}
														/>
													)}
												</Suggestion>
												{getActionIcon(sectionItem)}
											</React.Fragment>
										</FallbackRender>
									</li>
								))}
							</ul>
						</div>
					);
				}

				if (item._suggestion_type === '_internal_a_i_trigger') {
					return (
						<li
							{...getItemProps({ item })}
							key={`${index + 1}-${item.value}`}
							style={{
								justifyContent: 'flex-start',
								alignItems: 'center',
							}}
							className={`${
								highlightedIndex === index
									? `active-li-item ${getClassName(
											innerClass,
											'active-suggestion-item',
									  )}`
									: `li-item ${getClassName(innerClass, 'suggestion-item')}`
							}`}
						>
							<FallbackRender
								item={typeof renderItem === 'function' ? renderItem(item) : null}
							>
								<React.Fragment>
									<SuggestionItem currentValue={currentValue || ''} suggestion={item} />
								</React.Fragment>
							</FallbackRender>
						</li>
					);
				}
				return (
					<li
						{...getItemProps({ item })}
						key={`${index + 1}-${item.value}`}
						style={{
							justifyContent: 'flex-start',
							alignItems: 'center',
						}}
						className={`${
							highlightedIndex === index
								? `active-li-item ${getClassName(
										innerClass,
										'active-suggestion-item',
								  )}`
								: `li-item ${getClassName(innerClass, 'suggestion-item')}`
						}`}
					>
						<FallbackRender
							item={typeof renderItem === 'function' ? renderItem(item) : null}
						>
							<React.Fragment>
								<div
									style={{
										padding: '0 10px 0 0',
										display: 'flex',
									}}
								>
									<CustomSvg
										iconId={`${index + 1}-${item.value}-icon`}
										className={
											getClassName(innerClass, `${item._suggestion_type}-search-icon`) || null
										}
										icon={getIcon(item._suggestion_type, item)}
										type={`${item._suggestion_type}-search-icon`}
									/>
								</div>
								<SuggestionItem currentValue={currentValue || ''} suggestion={item} />
								{getActionIcon(item)}
							</React.Fragment>
						</FallbackRender>
					</li>
				);
			})}

			{showSuggestionsFooter ? <SuggestionsFooter /> : null}
		</Fragment>
	);
};

SuggestionsSection.propTypes = {
	showAIScreen: PropTypes.bool.isRequired,
	parsedSuggestions: PropTypes.func.isRequired,
	indexOffset: PropTypes.number,
	innerClass: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
	getItemProps: PropTypes.func.isRequired,
	highlightedIndex: PropTypes.number,
	renderItem: PropTypes.func,
	getIcon: PropTypes.func.isRequired,
	getActionIcon: PropTypes.func.isRequired,
	currentValue: PropTypes.string,
	showSuggestionsFooter: PropTypes.bool.isRequired,
	SuggestionsFooter: PropTypes.func.isRequired,
	hasSuggestions: PropTypes.func.isRequired,
	renderNoSuggestion: PropTypes.func.isRequired,
};

export default SuggestionsSection;
