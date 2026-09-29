import React from 'react';
import PropTypes from 'prop-types';
import InputGroup from '../../styles/InputGroup';
import InputWrapper from '../../styles/InputWrapper';
import { Actions as ActionContainer, TextArea } from '../../styles/Input';

const SearchInput = ({
	inputGroupRef,
	isOpen,
	inputRef,
	inputProps,
	renderLeftIcons,
	renderInputAddonBefore,
	renderRightIcons,
	renderInputAddonAfter,
	renderAskButtonElement,
	renderEnterButtonElement,
	themePreset,
	type,
	showFocusShortcutsIcon,
	showVoiceSearch,
	iconPosition,
	showIcon,
	showClear,
	renderSuggestionsDropdown,
	expandSuggestionsContainer,
}) => (
	<InputGroup searchBox ref={inputGroupRef} isOpen={isOpen}>
		<ActionContainer>
			{renderLeftIcons()}
			{renderInputAddonBefore()}
		</ActionContainer>
		<InputWrapper>
			<TextArea
				showFocusShortcutsIcon={showFocusShortcutsIcon}
				showVoiceSearch={showVoiceSearch}
				showIcon={showIcon}
				showClear={showClear}
				iconPosition={iconPosition}
				ref={inputRef}
				themePreset={themePreset}
				type={type}
				searchBox
				isOpen={isOpen}
				{...inputProps}
			/>
			{!expandSuggestionsContainer && renderSuggestionsDropdown && renderSuggestionsDropdown()}
		</InputWrapper>
		<ActionContainer>
			{renderRightIcons()}
			{renderInputAddonAfter()}
			{renderAskButtonElement()}
			{renderEnterButtonElement()}
		</ActionContainer>
	</InputGroup>
);

SearchInput.propTypes = {
	inputGroupRef: PropTypes.object,
	isOpen: PropTypes.bool,
	inputRef: PropTypes.object,
	inputProps: PropTypes.object.isRequired,
	renderLeftIcons: PropTypes.func.isRequired,
	renderInputAddonBefore: PropTypes.func.isRequired,
	renderRightIcons: PropTypes.func.isRequired,
	renderInputAddonAfter: PropTypes.func.isRequired,
	renderAskButtonElement: PropTypes.func.isRequired,
	renderEnterButtonElement: PropTypes.func.isRequired,
	themePreset: PropTypes.string,
	type: PropTypes.string,
	showFocusShortcutsIcon: PropTypes.bool,
	showVoiceSearch: PropTypes.bool,
	iconPosition: PropTypes.string,
	showIcon: PropTypes.bool,
	showClear: PropTypes.bool,
	renderSuggestionsDropdown: PropTypes.func,
	expandSuggestionsContainer: PropTypes.bool,
};

export default SearchInput;
