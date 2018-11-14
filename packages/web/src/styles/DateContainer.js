import styled, { css } from 'react-emotion';
import { withTheme } from 'emotion-theming';
import { lighten } from 'polished';

import { input } from './Input';

const DateContainer = styled.div`
	position: relative;

	.DayPicker {
		z-index: 1000;
		display: inline-block;
	}

	.DayPicker-wrapper {
		position: relative;
		user-select: none;
		padding-bottom: 1rem;
		flex-direction: row;
	}

	.DayPicker-Months {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}

	.DayPicker-Month {
		display: table;
		border-collapse: collapse;
		border-spacing: 0;
		user-select: none;
		margin: 0 1rem;
		margin-top: 1rem;
	}

	.DayPicker-NavButton {
		position: absolute;
		cursor: pointer;
		top: 1rem;
		right: 1.5rem;
		margin-top: 2px;
		color: #8b9898;
		width: 1.25rem;
		height: 1.25rem;
		display: inline-block;
		background-size: 50%;
		background-repeat: no-repeat;
		background-position: center;
	}

	.DayPicker-NavButton:hover {
		opacity: 0.8;
	}

	.DayPicker-NavButton--prev {
		margin-right: 1.5rem;
		background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAwCAYAAAB5R9gVAAAABGdBTUEAALGPC/xhBQAAAVVJREFUWAnN2G0KgjAYwPHpGfRkaZeqvgQaK+hY3SUHrk1YzNLay/OiEFp92I+/Mp2F2Mh2lLISWnflFjzH263RQjzMZ19wgs73ez0o1WmtW+dgA01VxrE3p6l2GLsnBy1VYQOtVSEH/atCCgqpQgKKqYIOiq2CBkqtggLKqQIKgqgCBjpJ2Y5CdJ+zrT9A7HHSTA1dxUdHgzCqJIEwq0SDsKsEg6iqBIEoq/wEcVRZBXFV+QJxV5mBtlDFB5VjYTaGZ2sf4R9PM7U9ZU+lLuaetPP/5Die3ToO1+u+MKtHs06qODB2zBnI/jBd4MPQm1VkY79Tb18gB+C62FdBFsZR6yeIo1YQiLJWMIiqVjQIu1YSCLNWFgijVjYIuhYYCKoWKAiiFgoopxYaKLUWOii2FgkophYp6F3r42W5A9s9OcgNvva8xQaysKXlFytoqdYmQH6tF3toSUo0INq9AAAAAElFTkSuQmCC');
	}

	.DayPicker-NavButton--next {
		background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAwCAYAAAB5R9gVAAAABGdBTUEAALGPC/xhBQAAAXRJREFUWAnN119ugjAcwPHWzJ1gnmxzB/BBE0n24m4xfNkTaOL7wOtsl3AXMMb+Vjaa1BG00N8fSEibPpAP3xAKKs2yjzTPH9RAjhEo9WzPr/Vm8zgE0+gXATAxxuxtqeJ9t5tIwv5AtQAApsfT6TPdbp+kUBcgVwvO51KqVhMkXKsVJFXrOkigVhCIs1Y4iKlWZxB1rX4gwlpRIIpa8SDkWmggrFq4IIRaJKCYWnSgnrXIQV1r8YD+1Vrn+bReagysIFfLABRt31v8oBu1xEBttfRbltmfjgEcWh9snUS2kNdBK6WN1vrOWxObWsz+fjxevsxmB1GQDfINWiev83nhaoiB/CoOU438oPrhXS0WpQ9xc1ZQWxWHqUYe0I0qrKCQKjygDlXIQV2r0IF6ViEBxVTBBSFUQQNhVYkHIVeJAtkNsbQ7c1LtzP6FsObhb2rCKv7NBIGoq4SDmKoEgTirXAcJVGkFSVVpgoSrXICGUMUH/QBZNSUy5XWUhwAAAABJRU5ErkJggg==');
	}

	.DayPicker-NavButton--interactionDisabled {
		display: none;
	}

	.DayPicker-Caption {
		padding: 0 0.5rem;
		display: table-caption;
		text-align: left;
		margin-bottom: 0.5rem;
	}

	.DayPicker-Caption > div {
		font-size: 1.15rem;
		font-weight: 500;
	}

	.DayPicker-Weekdays {
		margin-top: 1rem;
		display: table-header-group;
	}

	.DayPicker-WeekdaysRow {
		display: table-row;
	}

	.DayPicker-Weekday {
		display: table-cell;
		padding: 0.5rem;
		font-size: 0.875em;
		text-align: center;
		color: #8b9898;
	}

	.DayPicker-Weekday abbr[title] {
		border-bottom: none;
		text-decoration: none;
	}

	.DayPicker-Body {
		display: table-row-group;
	}

	.DayPicker-Week {
		display: table-row;
	}

	.DayPicker-Day {
		display: table-cell;
		padding: 0.5rem;
		text-align: center;
		cursor: pointer;
		vertical-align: middle;
		outline: none;
	}

	.DayPicker-WeekNumber {
		display: table-cell;
		padding: 0.5rem;
		text-align: right;
		vertical-align: middle;
		min-width: 1rem;
		font-size: 0.75em;
		cursor: pointer;
		color: #8b9898;
		border-right: 1px solid #eaecec;
	}

	.DayPicker--interactionDisabled .DayPicker-Day {
		cursor: default;
	}

	.DayPicker-Footer {
		padding-top: 0.5rem;
	}

	.DayPicker-TodayButton {
		border: none;
		background-image: none;
		background-color: transparent;
		-webkit-box-shadow: none;
		box-shadow: none;
		cursor: pointer;
		color: ${({ theme }) => theme.colors.primaryColor};
		font-size: 0.875em;
	}

	.DayPicker-Day--today {
		color: ${({ theme }) => theme.colors.primaryColor};
		font-weight: 700;
	}

	.DayPicker-Day--outside {
		cursor: default;
		color: #8b9898;
	}

	.DayPicker-Day--disabled {
		color: #dce0e0;
		cursor: default;
	}

	.DayPicker-Day--sunday {
		background-color: #f7f8f8;
	}

	.DayPicker-Day--sunday:not(.DayPicker-Day--today) {
		color: #dce0e0;
	}

	.DayPicker-Day--selected:not(.DayPicker-Day--disabled):not(.DayPicker-Day--outside) {
		position: relative;
		color: #f0f8ff;
		color: #f0f8ff;
		background-color: ${({ theme }) => theme.colors.primaryColor};
		border-radius: ${({ range }) => (range ? 0 : '100%')};
	}

	.DayPicker-Day--selected:not(.DayPicker-Day--disabled):not(.DayPicker-Day--outside):hover {
		background-color: ${({ theme }) => lighten(0.1, theme.colors.primaryColor)};
	}

	.DayPicker:not(.DayPicker--interactionDisabled)
		.DayPicker-Day:not(.DayPicker-Day--disabled):not(.DayPicker-Day--selected):not(.DayPicker-Day--outside):hover {
		background-color: ${({ theme }) => lighten(0.1, theme.colors.primaryColor)};
		border-radius: 50%;
	}

	.DayPicker-Day--selected.DayPicker-Day--start:not(.DayPicker-Day--disabled):not(.DayPicker-Day--outside) {
		border-top-left-radius: 50%;
		border-bottom-left-radius: 50%;
	}

	.DayPicker-Day--selected.DayPicker-Day--end:not(.DayPicker-Day--disabled):not(.DayPicker-Day--outside) {
		border-top-right-radius: 50%;
		border-bottom-right-radius: 50%;
	}

	.DayPicker-Day.DayPicker-Day--end:not(.DayPicker-Day--disabled):not(.DayPicker-Day--outside){
		border-top-right-radius: 50%;
		border-bottom-right-radius: 50%;
		background-color: ${({ theme }) => theme.colors.primaryColor || '#fff'};
		color: #fff;
	}

	.DayPickerInput {
		flex: 1;
	}

	.DayPickerInput input {
		${input};
		background-color: ${({ theme: { colors } }) => colors.backgroundColor || '#fff'};
		color: ${({ theme: { colors } }) => colors.textColor};
		${({ showBorder }) => !showBorder && css`
		border: none;
		`};
		&:focus {
			background-color: ${({ theme: { colors } }) => colors.backgroundColor || '#fff'};
		}
	}

	.DayPickerInput-OverlayWrapper {
		position: absolute;
		width: 100%;
		left: 0;
		z-index: 4;
	}

	.DayPickerInput-OverlayWrapper .DayPicker-Day--selected:not(.DayPicker-Day--start):not(.DayPicker-Day--end):not(.DayPicker-Day--outside){
		background-color:${({ theme }) => lighten(0.1, theme.colors.primaryColor) || '#f0f8ff'};
	}

	.DayPickerInput-Overlay {
		left: 0;
		top: 1px;
		z-index: 1;
		position: absolute;
		background: ${({ theme: { colors } }) =>
		(colors.backgroundColor
			? lighten(0.15, colors.backgroundColor)
			: '#fff')};
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
	}

	${({ theme }) => theme.component};
`;

export default withTheme(DateContainer);
