import styled, { css } from 'react-emotion';

const right = css`
	right: 35px;
`;

const MicImage = styled.img`
	height: 40px;
	position: absolute;
	top: calc(50% - 20px);
	cursor: pointer;
	right: 0;
	${({ iconPosition }) => {
		if (iconPosition === 'right') {
			return right;
		}
		return null;
	}};
`;

export default MicImage;
