import React, { Component } from 'react';
import { css } from 'react-emotion';
import PropTypes from 'prop-types';

const icon = css`
	position: absolute;
	width: 74px;
	height: 74px;
	border-radius: 50%;
	top: calc(50% - 37px);
	left: -37px;
	background-color: #fff;
	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.09);
	display: flex;
	justify-content: center;
	align-items: center;
`;

const cardWrapper = css`
	position: relative;
	padding: 32px 32px 32px 55px;
	margin-left: 37px;
	margin-bottom: 50px !important;
	text-align: left;
	background-color: #fff;
	border-radius: 2px;
	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);

	@media all and (max-width: 640px) {
		margin-bottom: 20px !important;
	}

	h4 {
		font-size: 16px;
		margin: 8px 0;
	}

	p {
		margin-top: 0;
		font-size: 14px !important;
	}
`;
class ActionCard extends Component {
	static Icon = ({ children }) => <div className={icon}>{children}</div>;

	render() {
		return <div className={cardWrapper}>{this.props.children}</div>;
	}
}

ActionCard.propTypes = {
	children: PropTypes.node,
};

export default ActionCard;
