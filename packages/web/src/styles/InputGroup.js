import { css } from '@emotion/core';
import styled from '@emotion/styled';

const InputGroup = styled.div`
	display: flex;
	align-items: stretch;
	width: 100%;
	box-shadow: rgb(0 0 0 / 20%) 0px 0px 6px;
	border-radius: 6px;
	overflow: hidden;
	${props =>
	props.isOpen
		&& css`
			border-bottom-left-radius: 0;
			border-bottom-right-radius: 0;
			border-bottom: 1px solid #f2f0f0;
			box-shadow: rgb(0 0 0 / 20%) 0px 0px 15px;
		`};
`;

InputGroup.defaultProps = { className: 'input-group' };

export default InputGroup;
