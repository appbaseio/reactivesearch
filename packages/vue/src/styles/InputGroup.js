import { styled } from '@appbaseio/vue-emotion';

const InputGroup = styled('div')`
	display: flex;
	align-items: stretch;
	width: 100%;
	box-shadow: rgb(0 0 0 / 20%) 0px 0px 6px;
	border-radius: 6px;

	${props =>
		props.isOpen
		&& 'box-shadow: rgb(0 0 0 / 20%) 0px 0px 15px;'}
};
`;

InputGroup.defaultProps = { className: 'input-group' };

export default InputGroup;
