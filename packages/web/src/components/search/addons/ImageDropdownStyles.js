import styled from '@emotion/styled';
import React from 'react';
import { DeleteIcon, ErrorIcon } from '../../shared/Icons';

const DROP_PLACEHOLDER_HEIGHT = '250px';

export const Container = styled.div`
	position: absolute;
	width: 100%;
	padding: 20px;
	background-color: ${props => props.theme.colors.backgroundColor || 'white'};
	box-shadow: rgb(0 0 0 / 20%) 0px 10px 15px;
	border-radius: 0px 0px 10px 10px;
	z-index: 1;
`;

export const FileInput = styled.input`
	width: 100%;
	padding: 10px;
	/*visually hide file input*/
	opacity: 0;
	position: absolute;
	z-index: -1;
	top: -100px;
`;
export const Preview = styled.div`
	position: relative;
	padding: 10px;
	margin: auto;
	min-width: 100px;
	max-width: 250px;
`;
export const PreviewImg = styled.img`
	width: 100%;
`;
export const Label = styled.label`
	cursor: pointer;
    color: ${props => props.theme.colors.primaryColor};
    text-decoration: underline;
`;
export const URLInput = styled.input`
	display: block;
	margin: 5px 0px;
	padding: 5px;
	width: 100%;
	padding: 8px 12px;
	border: 1px solid #ccc;
	background-color: ${props => props.theme.colors.backgroundColor || '#fafafa'};
	color: ${props => props.theme.colors.textColor || '#fff'};
	box-shadow: rgb(0 0 0 / 20%) 0px 0px 6px;
	border-radius: 6px;
	&:focus-within {
		background-color: ${props => props.theme.colors.backgroundColor || '#fff'};
	}
	${props =>
	props.isOpen
		&& `box-shadow: rgb(0 0 0 / 20%) 0px 0px 15px;
		border-bottom-left-radius: 0;
			border-bottom-right-radius: 0;`}
	};
`;
export const ORDivider = styled.div`
	display: flex;
	margin: 10px 0px;
`;
ORDivider.Divider = styled.hr`
	width: 100%;
	height: 2px;
	background-color: ${props => props.theme.colors.textColor};
	border-color:  ${props => props.theme.colors.textColor};
`;
ORDivider.Text = styled.div`
	margin: 0px 10px;
`;
export const ErrorMessage = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	padding: 3rem;
`;
ErrorMessage.Icon = props => (<ErrorIcon {...props} />);
ErrorMessage.Text = styled.div`
	text-align: center;
`;
export const PlaceholderText = styled.div`
	text-align: center;
`;

Container.Body = styled.div`
	min-height: ${DROP_PLACEHOLDER_HEIGHT};
	display: flex;
	flex-direction: column;
	justify-content: space-between;
`;

export const DropPlaceholder = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: ${DROP_PLACEHOLDER_HEIGHT};
	background-color: #c5e4f7;
	border: 1px dashed blue;
`;

export const StyledDeleteIcon = styled(DeleteIcon)`
	color: #0B6AFF;
	position: absolute;
	top: 10px;
	right: 10px;
	padding: 4px;
	background: rgb(250 250 250 / 90%);
	cursor: pointer;
`;
