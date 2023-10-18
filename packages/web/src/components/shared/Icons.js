import styled from '@emotion/styled';
import { object, string } from 'prop-types';
import React from 'react';

const ThemedSVG = styled.svg`
	color: ${props => props.theme.colors.primaryColor};
`;

const PlaceholderSVG = styled(ThemedSVG)`
	display: block;
	margin: auto;
`;

export const Placeholder = ({ style, size = '100px' }) => (
	<PlaceholderSVG style={style} width={size} height={size} viewBox="0 0 24 24" color="blue" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z" stroke="currentColor" strokeWidth="1.5" />
		<circle opacity="0.5" cx="16" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
		<path opacity="0.5" d="M5 13.307L5.81051 12.5542C6.73658 11.6941 8.18321 11.7424 9.04988 12.6623L11.6974 15.4727C12.2356 16.0439 13.1166 16.1209 13.7457 15.6516C14.6522 14.9753 15.9144 15.0522 16.7322 15.8334L19 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
	</PlaceholderSVG>
);

Placeholder.propTypes = {
	// eslint-disable-next-line react/forbid-prop-types
	style: object,
	size: string,
};

export const StyledErrorIcon = styled(ThemedSVG)`
`;

export const ErrorIcon = ({ size = '50px' }) => (
	<StyledErrorIcon width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm-1.5-5.009c0-.867.659-1.491 1.491-1.491.85 0 1.509.624 1.509 1.491 0 .867-.659 1.509-1.509 1.509-.832 0-1.491-.642-1.491-1.509zM11.172 6a.5.5 0 0 0-.499.522l.306 7a.5.5 0 0 0 .5.478h1.043a.5.5 0 0 0 .5-.478l.305-7a.5.5 0 0 0-.5-.522h-1.655z" fill="crimson" /></StyledErrorIcon>
);


ErrorIcon.propTypes = {
	size: string,
};

export const DeleteIcon = props => (
	<ThemedSVG {...props} width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M10 12V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
		<path d="M14 12V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
		<path d="M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
		<path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
		<path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
	</ThemedSVG>
);

export const CameraIcon = ({ size = '30px', ...props }) => (
	<ThemedSVG {...props} fill="currentColor" width={size} height={size} viewBox="0 -2 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
		<g id="Page-1" stroke="none" strokeWidth="1" fillRule="evenodd">
			<g id="Icon-Set-Filled" transform="translate(-258.000000, -467.000000)">
				<path d="M286,471 L283,471 L282,469 C281.411,467.837 281.104,467 280,467 L268,467 C266.896,467 266.53,467.954 266,469 L265,471 L262,471 C259.791,471 258,472.791 258,475 L258,491 C258,493.209 259.791,495 262,495 L286,495 C288.209,495 290,493.209 290,491 L290,475 C290,472.791 288.209,471 286,471 Z M274,491 C269.582,491 266,487.418 266,483 C266,478.582 269.582,475 274,475 C278.418,475 282,478.582 282,483 C282,487.418 278.418,491 274,491 Z M274,477 C270.687,477 268,479.687 268,483 C268,486.313 270.687,489 274,489 C277.313,489 280,486.313 280,483 C280,479.687 277.313,477 274,477 L274,477 Z" id="camera" />
			</g>
		</g>
	</ThemedSVG>);

CameraIcon.propTypes = {
	size: string,
};
