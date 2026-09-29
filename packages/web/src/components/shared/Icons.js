import styled from '@emotion/styled';
import { object, string } from 'prop-types';
import React from 'react';
import { Global, css } from '@emotion/core';
import types from '@appbaseio/reactivecore/lib/utils/types';

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

const iconRegistry = {
	cancel: {
		viewBox: '0 0 24 24',
		children: (
			<React.Fragment>
				<title>Clear</title>
				<path d="M0 0h24v24H0V0z" fill="none" />
				<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
			</React.Fragment>
		),
		defaultProps: {
			alt: 'Clear',
			className: 'cancel-icon',
			height: '20px',
			width: '20px',
		},
	},
	search: {
		viewBox: '0 0 15 15',
		children: (
			<React.Fragment>
				<title>Search</title>
				<path d="M6.02945,10.20327a4.17382,4.17382,0,1,1,4.17382-4.17382A4.15609,4.15609,0,0,1,6.02945,10.20327Zm9.69195,4.2199L10.8989,9.59979A5.88021,5.88021,0,0,0,12.058,6.02856,6.00467,6.00467,0,1,0,9.59979,10.8989l4.82338,4.82338a.89729.89729,0,0,0,1.29912,0,.89749.89749,0,0,0-.00087-1.29909Z" />
			</React.Fragment>
		),
		defaultProps: {
			alt: 'Search',
			className: 'search-icon',
			height: '12',
			style: {
				transform: 'scale(1.35)',
				position: 'relative',
			},
		},
	},
	thumbsUp: {
		viewBox: '0 0 24 24',
		children: (
			<path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
		),
		defaultProps: {
			stroke: 'currentColor',
			fill: 'none',
			strokeWidth: '2',
			strokeLinecap: 'round',
			strokeLinejoin: 'round',
			height: '1em',
			width: '1em',
		},
	},
	thumbsDown: {
		viewBox: '0 0 24 24',
		children: (
			<path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
		),
		defaultProps: {
			stroke: 'currentColor',
			fill: 'none',
			strokeWidth: '2',
			strokeLinecap: 'round',
			strokeLinejoin: 'round',
			height: '1em',
			width: '1em',
		},
	},
	mic: {
		viewBox: '0 0 480 480',
		children: (
			<React.Fragment>
				<Global
					styles={css`
						#el_TvxDfTAtKp {
							stroke: none;
							stroke-width: 1;
							fill: none;
						}
						#el_D93PK3GbmJ {
							-webkit-transform: translate(163px, 131px);
							transform: translate(163px, 131px);
							fill: #d8d8d8;
						}
					`}
				/>
				<g id="el_TvxDfTAtKp" fillRule="evenodd">
					<g id="el_D93PK3GbmJ" fillRule="nonzero">
						<path
							d="M142.731204,111 C137.280427,111 132.719573,114.852 131.82965,120.095 C127.268796,145.24 104.464526,164.5 76.9881611,164.5 C49.5117965,164.5 26.7075263,145.24 22.1466723,120.095 C21.2567496,114.852 16.6958955,111 11.2451187,111 C4.45945784,111 -0.880078594,116.778 0.121084488,123.198 C5.57186127,155.298 32.2695435,180.443 65.8641269,185.044 L65.8641269,207.3 C65.8641269,213.185 70.8699423,218 76.9881611,218 C83.10638,218 88.1121954,213.185 88.1121954,207.3 L88.1121954,185.044 C121.706779,180.443 148.404461,155.298 153.855238,123.198 C154.967641,116.778 149.516864,111 142.731204,111 Z"
							id="el_uly3EwA2O3"
						/>
						<path
							d="M76.9864699,147.789474 C98.090352,147.789474 115.126016,131.286316 115.126016,110.842105 L115.126016,36.9473684 C115.126016,16.5031579 98.090352,-2.84217094e-14 76.9864699,-2.84217094e-14 C55.8825877,-2.84217094e-14 38.8469239,16.5031579 38.8469239,36.9473684 L38.8469239,110.842105 C38.8469239,131.286316 55.8825877,147.789474 76.9864699,147.789474 Z"
							id="el_tnDbR4ytu4"
						/>
					</g>
				</g>
			</React.Fragment>
		),
		defaultProps: {
			id: 'el_xS0FRzQjJ',
			width: 28,
			height: 28,
			style: { transform: 'scale(1.5)' },
		},
	},
	mute: {
		viewBox: '0 0 480 480',
		children: (
			<React.Fragment>
				<Global
					styles={css`
						#el_X81iT9kZYo {
							stroke: none;
							stroke-width: 1;
							fill: none;
						}
						#el_gMpyalCphp {
							-webkit-transform: translate(163px, 131px);
							transform: translate(163px, 131px);
						}
						#el_c7H-3u-D4l {
							fill: #d8d8d8;
						}
						#el_qhFcdAAFwo {
							fill: #d8d8d8;
						}
						#el_M8X8g37WOI {
							stroke: #e83137;
							stroke-width: 21;
						}
					`}
				/>
				<g id="el_X81iT9kZYo" fillRule="evenodd">
					<g id="el_gMpyalCphp">
						<path
							d="M142.731204,111 C137.280427,111 132.719573,114.852 131.82965,120.095 C127.268796,145.24 104.464526,164.5 76.9881611,164.5 C49.5117965,164.5 26.7075263,145.24 22.1466723,120.095 C21.2567496,114.852 16.6958955,111 11.2451187,111 C4.45945784,111 -0.880078594,116.778 0.121084488,123.198 C5.57186127,155.298 32.2695435,180.443 65.8641269,185.044 L65.8641269,207.3 C65.8641269,213.185 70.8699423,218 76.9881611,218 C83.10638,218 88.1121954,213.185 88.1121954,207.3 L88.1121954,185.044 C121.706779,180.443 148.404461,155.298 153.855238,123.198 C154.967641,116.778 149.516864,111 142.731204,111 Z"
							id="el_c7H-3u-D4l"
							fillRule="nonzero"
							style={{ fill: '#595959' }}
						/>
						<path
							d="M76.9864699,147.789474 C98.090352,147.789474 115.126016,131.286316 115.126016,110.842105 L115.126016,36.9473684 C115.126016,16.5031579 98.090352,-2.84217094e-14 76.9864699,-2.84217094e-14 C55.8825877,-2.84217094e-14 38.8469239,16.5031579 38.8469239,36.9473684 L38.8469239,110.842105 C38.8469239,131.286316 55.8825877,147.789474 76.9864699,147.789474 Z"
							id="el_qhFcdAAFwo"
							fillRule="nonzero"
							style={{ fill: '#595959' }}
						/>
						<path
							d="M11.5,206.5 L142.5,12.5"
							id="el_M8X8g37WOI"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</g>
				</g>
			</React.Fragment>
		),
		defaultProps: {
			id: 'el_D1rEpH2zj',
			width: 28,
			height: 28,
			style: { transform: 'scale(1.5)' },
		},
	},
	listen: {
		viewBox: '0 0 480 480',
		children: (
			<React.Fragment>
				<Global
					styles={css`
						@-webkit-keyframes kf_el_6WKby7wXqV_an_qqO-rxbNc {
							0% { opacity: 0; }
							13.89% { opacity: 1; }
							100% { opacity: 1; }
						}
						@keyframes kf_el_6WKby7wXqV_an_qqO-rxbNc {
							0% { opacity: 0; }
							13.89% { opacity: 1; }
							100% { opacity: 1; }
						}
						@-webkit-keyframes kf_el_Wi-my975tM_an_XhXP1epXB {
							0% { opacity: 0; }
							27.78% { opacity: 1; }
							100% { opacity: 1; }
						}
						@keyframes kf_el_Wi-my975tM_an_XhXP1epXB {
							0% { opacity: 0; }
							27.78% { opacity: 1; }
							100% { opacity: 1; }
						}
						@-webkit-keyframes kf_el_DkfFFTaFxy8_an_T2XxzvIaA {
							0% { opacity: 0; }
							41.67% { opacity: 1; }
							100% { opacity: 1; }
						}
						@keyframes kf_el_DkfFFTaFxy8_an_T2XxzvIaA {
							0% { opacity: 0; }
							41.67% { opacity: 1; }
							100% { opacity: 1; }
						}
						@-webkit-keyframes kf_el_34IgwiMB5rf_an_TPom3H2LI {
							0% { opacity: 0; }
							55.56% { opacity: 1; }
							100% { opacity: 1; }
						}
						@keyframes kf_el_34IgwiMB5rf_an_TPom3H2LI {
							0% { opacity: 0; }
							55.56% { opacity: 1; }
							100% { opacity: 1; }
						}
						@-webkit-keyframes kf_el_DeebuCsPTGA_an_aYTRBE7Na {
							0% { opacity: 0; }
							69.44% { opacity: 1; }
							100% { opacity: 1; }
						}
						@keyframes kf_el_DeebuCsPTGA_an_aYTRBE7Na {
							0% { opacity: 0; }
							69.44% { opacity: 1; }
							100% { opacity: 1; }
						}
						@-webkit-keyframes kf_el_ZOjjrPTvyrv_an_l_BjBNzXw {
							0% { opacity: 0; }
							83.33% { opacity: 1; }
							100% { opacity: 1; }
						}
						@keyframes kf_el_ZOjjrPTvyrv_an_l_BjBNzXw {
							0% { opacity: 0; }
							83.33% { opacity: 1; }
							100% { opacity: 1; }
						}
						@-webkit-keyframes kf_el_2FATegVmf0K_an_wLg4ofuFx {
							0% { opacity: 0; }
							97.22% { opacity: 1; }
							100% { opacity: 1; }
						}
						@keyframes kf_el_2FATegVmf0K_an_wLg4ofuFx {
							0% { opacity: 0; }
							97.22% { opacity: 1; }
							100% { opacity: 1; }
						}
						#el_hiibMG0x- * {
							-webkit-animation-duration: 1.2s;
							animation-duration: 1.2s;
							-webkit-animation-iteration-count: infinite;
							animation-iteration-count: infinite;
							-webkit-animation-timing-function: cubic-bezier(0, 0, 1, 1);
							animation-timing-function: cubic-bezier(0, 0, 1, 1);
						}
						#el_QJeJ_2CDw5 {
							stroke: none;
							stroke-width: 1;
							fill: none;
						}
						#el_UYYCfubTRf {
							-webkit-transform: translate(163px, 123px);
							transform: translate(163px, 123px);
						}
						#el_uzZNtK32Zi {
							fill: #d8d8d8;
						}
						#el_EYKQ2N9Kgy {
							fill: #d8d8d8;
						}
						#el_6SDP2LAgKC {
							-webkit-transform: translate(37.846924px, 0px);
							transform: translate(37.846924px, 0px);
						}
						#el_-Vm65Ltfy7 {
							fill: #2196f3;
						}
						#el_q04iZcSim4 {
							fill: #d8d8d8;
						}
						#el_6WKby7wXqV {
							-webkit-transform: translate(37.846924px, 0px);
							transform: translate(37.846924px, 0px);
							-webkit-animation-fill-mode: backwards;
							animation-fill-mode: backwards;
							opacity: 0;
							-webkit-animation-name: kf_el_6WKby7wXqV_an_qqO-rxbNc;
							animation-name: kf_el_6WKby7wXqV_an_qqO-rxbNc;
							-webkit-animation-timing-function: cubic-bezier(0.42, 0, 1, 1);
							animation-timing-function: cubic-bezier(0.42, 0, 1, 1);
						}
						#el_9bggsfQOtU {
							fill: #2196f3;
						}
						#el_NKxqi9eIym {
							fill: #d8d8d8;
						}
						#el_Wi-my975tM {
							-webkit-transform: translate(37.846924px, 0px);
							transform: translate(37.846924px, 0px);
							-webkit-animation-fill-mode: backwards;
							animation-fill-mode: backwards;
							opacity: 0;
							-webkit-animation-name: kf_el_Wi-my975tM_an_XhXP1epXB;
							animation-name: kf_el_Wi-my975tM_an_XhXP1epXB;
							-webkit-animation-timing-function: cubic-bezier(0.42, 0, 1, 1);
							animation-timing-function: cubic-bezier(0.42, 0, 1, 1);
						}
						#el_zclQ34fvf7 {
							fill: #2196f3;
						}
						#el_1OsvRT8HkeZ {
							fill: #d8d8d8;
						}
						#el_DkfFFTaFxy8 {
							-webkit-transform: translate(37.846924px, 0px);
							transform: translate(37.846924px, 0px);
							-webkit-animation-fill-mode: backwards;
							animation-fill-mode: backwards;
							opacity: 0;
							-webkit-animation-name: kf_el_DkfFFTaFxy8_an_T2XxzvIaA;
							animation-name: kf_el_DkfFFTaFxy8_an_T2XxzvIaA;
							-webkit-animation-timing-function: cubic-bezier(0.42, 0, 1, 1);
							animation-timing-function: cubic-bezier(0.42, 0, 1, 1);
						}
						#el_aa9sjx4H0vA {
							fill: #2196f3;
						}
						#el_tea114vWg0J {
							fill: #d8d8d8;
						}
						#el_34IgwiMB5rf {
							-webkit-transform: translate(37.846924px, 0px);
							transform: translate(37.846924px, 0px);
							-webkit-animation-fill-mode: backwards;
							animation-fill-mode: backwards;
							opacity: 0;
							-webkit-animation-name: kf_el_34IgwiMB5rf_an_TPom3H2LI;
							animation-name: kf_el_34IgwiMB5rf_an_TPom3H2LI;
							-webkit-animation-timing-function: cubic-bezier(0.42, 0, 1, 1);
							animation-timing-function: cubic-bezier(0.42, 0, 1, 1);
						}
						#el_z5u6RAFhx7d {
							fill: #2196f3;
						}
						#el_7nfuWmA5Uhy {
							fill: #d8d8d8;
						}
						#el_DeebuCsPTGA {
							-webkit-transform: translate(37.846924px, 0px);
							transform: translate(37.846924px, 0px);
							-webkit-animation-fill-mode: backwards;
							animation-fill-mode: backwards;
							opacity: 0;
							-webkit-animation-name: kf_el_DeebuCsPTGA_an_aYTRBE7Na;
							animation-name: kf_el_DeebuCsPTGA_an_aYTRBE7Na;
							-webkit-animation-timing-function: cubic-bezier(0.42, 0, 1, 1);
							animation-timing-function: cubic-bezier(0.42, 0, 1, 1);
						}
						#el__ZcqlS20zcw {
							fill: #2196f3;
						}
						#el_8DnEQnD7VWV {
							fill: #d8d8d8;
						}
						#el_ZOjjrPTvyrv {
							-webkit-transform: translate(37.846924px, 0px);
							transform: translate(37.846924px, 0px);
							-webkit-animation-fill-mode: backwards;
							animation-fill-mode: backwards;
							opacity: 0;
							-webkit-animation-name: kf_el_ZOjjrPTvyrv_an_l_BjBNzXw;
							animation-name: kf_el_ZOjjrPTvyrv_an_l_BjBNzXw;
							-webkit-animation-timing-function: cubic-bezier(0.42, 0, 1, 1);
							animation-timing-function: cubic-bezier(0.42, 0, 1, 1);
						}
						#el_FYYKCI_u24e {
							fill: #2196f3;
						}
						#el_XZty4MnTp5Y {
							fill: #d8d8d8;
						}
						#el_2FATegVmf0K {
							-webkit-transform: translate(37.846924px, 0px);
							transform: translate(37.846924px, 0px);
							-webkit-animation-fill-mode: backwards;
							animation-fill-mode: backwards;
							opacity: 0;
							-webkit-animation-name: kf_el_2FATegVmf0K_an_wLg4ofuFx;
							animation-name: kf_el_2FATegVmf0K_an_wLg4ofuFx;
							-webkit-animation-timing-function: cubic-bezier(0.42, 0, 1, 1);
							animation-timing-function: cubic-bezier(0.42, 0, 1, 1);
						}
						#el_RMT1KUfbdF8 {
							fill: #2196f3;
						}
						#el_RgLcovvFiO1 {
							fill: #d8d8d8;
						}
					`}
				/>
				<defs>
					<path d="M38.779092,147.789474 C60.0824253,147.789474 77.279092,131.286316 77.279092,110.842105 L77.279092,36.9473684 C77.279092,16.5031579 60.0824253,0 38.779092,0 C17.4757586,0 0.279091964,16.5031579 0.279091964,36.9473684 L0.279091964,110.842105 C0.279091964,131.286316 17.4757586,147.789474 38.779092,147.789474 Z" id="path-1" />
					<path d="M38.779092,147.789474 C60.0824253,147.789474 77.279092,131.286316 77.279092,110.842105 L77.279092,36.9473684 C77.279092,16.5031579 60.0824253,0 38.779092,0 C17.4757586,0 0.279091964,16.5031579 0.279091964,36.9473684 L0.279091964,110.842105 C0.279091964,131.286316 17.4757586,147.789474 38.779092,147.789474 Z" id="path-3" />
					<path d="M38.779092,147.789474 C60.0824253,147.789474 77.279092,131.286316 77.279092,110.842105 L77.279092,36.9473684 C77.279092,16.5031579 60.0824253,0 38.779092,0 C17.4757586,0 0.279091964,16.5031579 0.279091964,36.9473684 L0.279091964,110.842105 C0.279091964,131.286316 17.4757586,147.789474 38.779092,147.789474 Z" id="path-5" />
					<path d="M38.779092,147.789474 C60.0824253,147.789474 77.279092,131.286316 77.279092,110.842105 L77.279092,36.9473684 C77.279092,16.5031579 60.0824253,0 38.779092,0 C17.4757586,0 0.279091964,16.5031579 0.279091964,36.9473684 L0.279091964,110.842105 C0.279091964,131.286316 17.4757586,147.789474 38.779092,147.789474 Z" id="path-7" />
					<path d="M38.779092,147.789474 C60.0824253,147.789474 77.279092,131.286316 77.279092,110.842105 L77.279092,36.9473684 C77.279092,16.5031579 60.0824253,0 38.779092,0 C17.4757586,0 0.279091964,16.5031579 0.279091964,36.9473684 L0.279091964,110.842105 C0.279091964,131.286316 17.4757586,147.789474 38.779092,147.789474 Z" id="path-9" />
					<path d="M38.779092,147.789474 C60.0824253,147.789474 77.279092,131.286316 77.279092,110.842105 L77.279092,36.9473684 C77.279092,16.5031579 60.0824253,0 38.779092,0 C17.4757586,0 0.279091964,16.5031579 0.279091964,36.9473684 L0.279091964,110.842105 C0.279091964,131.286316 17.4757586,147.789474 38.779092,147.789474 Z" id="path-11" />
					<path d="M38.779092,147.789474 C60.0824253,147.789474 77.279092,131.286316 77.279092,110.842105 L77.279092,36.9473684 C77.279092,16.5031579 60.0824253,0 38.779092,0 C17.4757586,0 0.279091964,16.5031579 0.279091964,36.9473684 L0.279091964,110.842105 C0.279091964,131.286316 17.4757586,147.789474 38.779092,147.789474 Z" id="path-13" />
					<path d="M38.779092,147.789474 C60.0824253,147.789474 77.279092,131.286316 77.279092,110.842105 L77.279092,36.9473684 C77.279092,16.5031579 60.0824253,0 38.779092,0 C17.4757586,0 0.279091964,16.5031579 0.279091964,36.9473684 L0.279091964,110.842105 C0.279091964,131.286316 17.4757586,147.789474 38.779092,147.789474 Z" id="path-15" />
				</defs>
				<g id="el_QJeJ_2CDw5" fillRule="evenodd">
					<g id="el_UYYCfubTRf">
						<path d="M142.731204,111 C137.280427,111 132.719573,114.852 131.82965,120.095 C127.268796,145.24 104.464526,164.5 76.9881611,164.5 C49.5117965,164.5 26.7075263,145.24 22.1466723,120.095 C21.2567496,114.852 16.6958955,111 11.2451187,111 C4.45945784,111 -0.880078594,116.778 0.121084488,123.198 C5.57186127,155.298 32.2695435,180.443 65.8641269,185.044 L65.8641269,207.3 C65.8641269,213.185 70.8699423,218 76.9881611,218 C83.10638,218 88.1121954,213.185 88.1121954,207.3 L88.1121954,185.044 C121.706779,180.443 148.404461,155.298 153.855238,123.198 C154.967641,116.778 149.516864,111 142.731204,111 Z" id="el_uzZNtK32Zi" fillRule="nonzero" style={{ fill: '#2196F3' }} />
						<path d="M76.9864699,147.789474 C98.090352,147.789474 115.126016,131.286316 115.126016,110.842105 L115.126016,36.9473684 C115.126016,16.5031579 98.090352,0 76.9864699,0 C55.8825877,0 38.8469239,16.5031579 38.8469239,36.9473684 L38.8469239,110.842105 C38.8469239,131.286316 55.8825877,147.789474 76.9864699,147.789474 Z" id="el_EYKQ2N9Kgy" fillRule="nonzero" />
						<g id="el_6SDP2LAgKC">
							<mask id="mask-2" fill="#fff"><use xlinkHref="#path-1" /></mask>
							<path d="M38.779092,147.789474 C60.0824253,147.789474 77.279092,131.286316 77.279092,110.842105 L77.279092,36.9473684 C77.279092,16.5031579 60.0824253,0 38.779092,0 C17.4757586,0 0.279091964,16.5031579 0.279091964,36.9473684 L0.279091964,110.842105 C0.279091964,131.286316 17.4757586,147.789474 38.779092,147.789474 Z" id="el_-Vm65Ltfy7" fillRule="nonzero" mask="url(#mask-2)" />
							<rect id="el_q04iZcSim4" mask="url(#mask-2)" x="0.279" width="77" height="130" />
						</g>
						<g id="el_6WKby7wXqV">
							<mask id="mask-4" fill="#fff"><use xlinkHref="#path-3" /></mask>
							<path d="M38.779092,147.789474 C60.0824253,147.789474 77.279092,131.286316 77.279092,110.842105 L77.279092,36.9473684 C77.279092,16.5031579 60.0824253,0 38.779092,0 C17.4757586,0 0.279091964,16.5031579 0.279091964,36.9473684 L0.279091964,110.842105 C0.279091964,131.286316 17.4757586,147.789474 38.779092,147.789474 Z" id="el_9bggsfQOtU" fillRule="nonzero" mask="url(#mask-4)" />
							<rect id="el_NKxqi9eIym" mask="url(#mask-4)" x="0.279" width="77" height="115" />
						</g>
						<g id="el_Wi-my975tM">
							<mask id="mask-6" fill="#fff"><use xlinkHref="#path-5" /></mask>
							<path d="M38.779092,147.789474 C60.0824253,147.789474 77.279092,131.286316 77.279092,110.842105 L77.279092,36.9473684 C77.279092,16.5031579 60.0824253,0 38.779092,0 C17.4757586,0 0.279091964,16.5031579 0.279091964,36.9473684 L0.279091964,110.842105 C0.279091964,131.286316 17.4757586,147.789474 38.779092,147.789474 Z" id="el_zclQ34fvf7" fillRule="nonzero" mask="url(#mask-6)" />
							<rect id="el_1OsvRT8HkeZ" mask="url(#mask-6)" x="0.279" width="77" height="100" />
						</g>
						<g id="el_DkfFFTaFxy8">
							<mask id="mask-8" fill="#fff"><use xlinkHref="#path-7" /></mask>
							<path d="M38.779092,147.789474 C60.0824253,147.789474 77.279092,131.286316 77.279092,110.842105 L77.279092,36.9473684 C77.279092,16.5031579 60.0824253,0 38.779092,0 C17.4757586,0 0.279091964,16.5031579 0.279091964,36.9473684 L0.279091964,110.842105 C0.279091964,131.286316 17.4757586,147.789474 38.779092,147.789474 Z" id="el_aa9sjx4H0vA" fillRule="nonzero" mask="url(#mask-8)" />
							<rect id="el_tea114vWg0J" mask="url(#mask-8)" x="0.279" width="77" height="85" />
						</g>
						<g id="el_34IgwiMB5rf">
							<mask id="mask-10" fill="#fff"><use xlinkHref="#path-9" /></mask>
							<path d="M38.779092,147.789474 C60.0824253,147.789474 77.279092,131.286316 77.279092,110.842105 L77.279092,36.9473684 C77.279092,16.5031579 60.0824253,0 38.779092,0 C17.4757586,0 0.279091964,16.5031579 0.279091964,36.9473684 L0.279091964,110.842105 C0.279091964,131.286316 17.4757586,147.789474 38.779092,147.789474 Z" id="el_z5u6RAFhx7d" fillRule="nonzero" mask="url(#mask-10)" />
							<rect id="el_7nfuWmA5Uhy" mask="url(#mask-10)" x="0.279" width="77" height="70" />
						</g>
						<g id="el_DeebuCsPTGA">
							<mask id="mask-12" fill="#fff"><use xlinkHref="#path-11" /></mask>
							<path d="M38.779092,147.789474 C60.0824253,147.789474 77.279092,131.286316 77.279092,110.842105 L77.279092,36.9473684 C77.279092,16.5031579 60.0824253,0 38.779092,0 C17.4757586,0 0.279091964,16.5031579 0.279091964,36.9473684 L0.279091964,110.842105 C0.279091964,131.286316 17.4757586,147.789474 38.779092,147.789474 Z" id="el__ZcqlS20zcw" fillRule="nonzero" mask="url(#mask-12)" />
							<rect id="el_8DnEQnD7VWV" mask="url(#mask-12)" x="0.279" width="77" height="55" />
						</g>
						<g id="el_ZOjjrPTvyrv">
							<mask id="mask-14" fill="#fff"><use xlinkHref="#path-13" /></mask>
							<path d="M38.779092,147.789474 C60.0824253,147.789474 77.279092,131.286316 77.279092,110.842105 L77.279092,36.9473684 C77.279092,16.5031579 60.0824253,0 38.779092,0 C17.4757586,0 0.279091964,16.5031579 0.279091964,36.9473684 L0.279091964,110.842105 C0.279091964,131.286316 17.4757586,147.789474 38.779092,147.789474 Z" id="el_FYYKCI_u24e" fillRule="nonzero" mask="url(#mask-14)" />
							<rect id="el_XZty4MnTp5Y" mask="url(#mask-14)" x="0.279" width="77" height="40" />
						</g>
						<g id="el_2FATegVmf0K">
							<mask id="mask-16" fill="#fff"><use xlinkHref="#path-15" /></mask>
							<path d="M38.779092,147.789474 C60.0824253,147.789474 77.279092,131.286316 77.279092,110.842105 L77.279092,36.9473684 C77.279092,16.5031579 60.0824253,0 38.779092,0 C17.4757586,0 0.279091964,16.5031579 0.279091964,36.9473684 L0.279091964,110.842105 C0.279091964,131.286316 17.4757586,147.789474 38.779092,147.789474 Z" id="el_RMT1KUfbdF8" fillRule="nonzero" mask="url(#mask-16)" />
							<rect id="el_RgLcovvFiO1" mask="url(#mask-16)" x="0.279" width="77" height="25" />
						</g>
					</g>
				</g>
			</React.Fragment>
	),
	defaultProps: {
		xmlnsXlink: 'http://www.w3.org/1999/xlink',
		id: 'el_hiibMG0x-',
		width: 28,
		height: 29,
		style: { transform: 'scale(1.5)' },
	},
},
};

export const Icon = React.forwardRef(({ name, style, ...props }, ref) => {
	const iconConfig = iconRegistry[name];
	if (!iconConfig) return null;

	const { children, viewBox, defaultProps } = iconConfig;

	return (
		<svg
			ref={ref}
			viewBox={viewBox}
			xmlns="http://www.w3.org/2000/svg"
			{...defaultProps}
			{...props}
			style={{
				...(defaultProps.style || {}),
				...(style || {}),
			}}
		>
			{children}
		</svg>
	);
});

Icon.propTypes = {
	name: string.isRequired,
	style: object,
};

export const CancelSvg = React.forwardRef((props, ref) => <Icon ref={ref} name="cancel" {...props} />);
export const SearchSvg = React.forwardRef((props, ref) => <Icon ref={ref} name="search" {...props} />);
export const ThumbsUpSvg = React.forwardRef((props, ref) => <Icon ref={ref} name="thumbsUp" {...props} />);
export const ThumbsDownSvg = React.forwardRef((props, ref) => <Icon ref={ref} name="thumbsDown" {...props} />);
export const MicSvg = React.forwardRef((props, ref) => <Icon ref={ref} name="mic" {...props} />);
export const MuteSvg = React.forwardRef((props, ref) => <Icon ref={ref} name="mute" {...props} />);
export const ListenSvg = React.forwardRef((props, ref) => <Icon ref={ref} name="listen" {...props} />);

CancelSvg.propTypes = {
	onClick: types.func,
};

SearchSvg.propTypes = {
	style: types.style,
};

ThumbsUpSvg.propTypes = {
	onClick: types.func,
	className: types.string,
};

ThumbsDownSvg.propTypes = {
	onClick: types.func,
	className: types.string,
};

const AutofillSvgIcon = styled.button`
	display: flex;
	margin-left: auto;
	position: relative;
	right: -3px;
	border: none;
	outline: none;
	background: transparent;
	padding: 0;
	z-index: 111;

	svg {
		cursor: pointer;
		fill: #707070;
		height: 17px;
	}

	&:hover {
		svg {
			fill: #1c1a1a;
		}
	}
`;

export const SelectArrowSvg = props => (
	<AutofillSvgIcon {...props}>
		<svg viewBox="0 0 24 24">
			<path d="M8 17v-7.586l8.293 8.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-8.293-8.293h7.586c0.552 0 1-0.448 1-1s-0.448-1-1-1h-10c-0.552 0-1 0.448-1 1v10c0 0.552 0.448 1 1 1s1-0.448 1-1z" />
		</svg>
	</AutofillSvgIcon>
);

const DownloadSvgWrapper = styled.span`
	text-decoration: underline;
	text-decoration-thickness: 2px;
	position: relative;
	top: -1px;
	margin-left: 2px;
`;

export const DownloadSvg = props => <DownloadSvgWrapper {...props}>⬇</DownloadSvgWrapper>;
