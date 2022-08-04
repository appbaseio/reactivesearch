import React from 'react';
import styled from '@emotion/styled';

const DownloadSvgWrapper = styled.span`
	text-decoration: underline;
	text-decoration-thickness: 2px;
	position: relative;
	top: -1px;
	margin-left: 2px;
`;

const DownloadSvg = props => <DownloadSvgWrapper {...props}>⬇</DownloadSvgWrapper>;

export default DownloadSvg;
