import React from 'react';
import styled from '@emotion/styled';
import { string } from 'prop-types';
import types from '@appbaseio/reactivecore/lib/utils/types';
import IconWrapper from '../../../styles/IconWrapper';
import { CameraIcon as CameraSVG } from '../../shared/Icons';

export const CameraIcon = ({
	onClick, title, icon, iconURL,
}) => {
	const defaultIcon = <CameraSVG />;
	const ImageSearchIcon = icon || defaultIcon;
	const ImageSearchURLIcon = iconURL
		? (
			<img
				src={iconURL}
				width="30px"
				alt="icon"
			/>
		) : null;

	return (
		<IconWrapper onClick={onClick} title={title}>
			{ImageSearchURLIcon || ImageSearchIcon}
		</IconWrapper>
	);
};
CameraIcon.propTypes = {
	fill: string,
	title: string,
	onClick: types.func,
	iconURL: string,
	icon: types.children,
};
CameraIcon.defaultProps = {
	fill: 'blue',
};
export const Thumbnail = styled.img`
	width: 30px;
	height: 30px;
	cursor: pointer;
`;
