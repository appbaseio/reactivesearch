import { styled } from '@appbaseio/vue-emotion';

const IconGroup = styled('div')`
	display: flex;
	align-items: center;
	justify-content: center;
	grid-gap: 6px;
	margin: 0 10px;
	height: 100%;

	${({ positionType }) => {
		if (positionType === 'absolute') {
			return `
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
			`;
		}
		return null;
	}};

	${({ groupPosition }) =>
		groupPosition === 'right'
			? `
					right: 0;
			  `
			: `
					left: 0;
			  `};
`;

export default IconGroup;
