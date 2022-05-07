import styled from '@emotion/styled';

const InputAddon = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #fafafa;
	border: 1px solid transparent;
	color: rgba(0, 0, 0, 0.85);
	font-size: 14px;
	font-weight: 400;
	padding: 0 11px;
	position: relative;
	transition: all 0.3s;
	box-sizing: border-box;
	overflow: hidden;

	&:first-of-type {
		border-right: 1px solid #f0efef;
	}
	&:last-of-type {
		border-left: 1px solid #f0efef;
	}
`;

InputAddon.defaultProps = { className: 'input-addon' };

export default InputAddon;
