import styled from 'react-emotion';

const MapPin = styled('div')`
	height: 24px;
	width: auto;
	background-color: #fff;
	border-radius: 2px;
	color: #222;
	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.15);
	padding: 3px 6px;
	font-size: 15px;
`;

const MapPinArrow = styled('div')`
	border-color: rgba(0, 0, 0, 0.2);
	border-style: solid;
	border-width: 0 1px 1px 0;
	margin-left: -6px;
	background-color: #fff;
	margin-top: -6px;
	width: 12px;
	height: 12px;
	-webkit-transform: rotate(45deg);
	-ms-transform: rotate(45deg);
	transform: rotate(45deg);
`;

export {
	MapPin,
	MapPinArrow,
};
