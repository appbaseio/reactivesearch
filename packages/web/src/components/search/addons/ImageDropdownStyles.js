import styled from '@emotion/styled';
import React from 'react';
import { ErrorIcon } from '../../shared/Icons';

export const Container = styled.div`
	position: absolute;
	width: 100%;
	padding: 10px;
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
	border-radius: 10px;
	border: 2px solid gray;
	width: 100%;
	background-color: ${props => props.theme.colors.backgroundColor};
	color: ${props => props.theme.colors.textColor};
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
