import { styled } from '@appbaseio/vue-emotion';

const InputGroup = styled('div')`
  	display: flex;
	align-items: stretch;
	width: 100%;
	box-shadow: rgb(0 0 0 / 20%) 0px 0px 6px;
	border-radius: 6px;

	${({theme, searchBox}) => searchBox
		&& `background-color: ${theme.colors.backgroundColor|| '#fafafa'};
		color: ${theme.colors.textColor || '#fff'};

		&:focus-within {
			background-color: ${theme.colors.backgroundColor || '#fff'};
		}`
}
	${props =>
		props.isOpen
		&& 'box-shadow: rgb(0 0 0 / 20%) 0px 0px 15px;'}
	};
`;

InputGroup.defaultProps = { className: 'input-group' };

export default InputGroup;
