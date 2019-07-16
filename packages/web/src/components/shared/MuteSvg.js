import React from 'react';

import { injectGlobal } from 'emotion';

// eslint-disable-next-line
injectGlobal`
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
`;

const MuteSvg = props => (
	<svg
		viewBox="0 0 480 480"
		xmlns="http://www.w3.org/2000/svg"
		id="el_D1rEpH2zj"
		width={45}
		{...props}
	>
		<g id="el_X81iT9kZYo" fillRule="evenodd">
			<g id="el_gMpyalCphp">
				<path
					d="M142.731204,111 C137.280427,111 132.719573,114.852 131.82965,120.095 C127.268796,145.24 104.464526,164.5 76.9881611,164.5 C49.5117965,164.5 26.7075263,145.24 22.1466723,120.095 C21.2567496,114.852 16.6958955,111 11.2451187,111 C4.45945784,111 -0.880078594,116.778 0.121084488,123.198 C5.57186127,155.298 32.2695435,180.443 65.8641269,185.044 L65.8641269,207.3 C65.8641269,213.185 70.8699423,218 76.9881611,218 C83.10638,218 88.1121954,213.185 88.1121954,207.3 L88.1121954,185.044 C121.706779,180.443 148.404461,155.298 153.855238,123.198 C154.967641,116.778 149.516864,111 142.731204,111 Z"
					id="el_c7H-3u-D4l"
					fillRule="nonzero"
				/>
				<path
					d="M76.9864699,147.789474 C98.090352,147.789474 115.126016,131.286316 115.126016,110.842105 L115.126016,36.9473684 C115.126016,16.5031579 98.090352,-2.84217094e-14 76.9864699,-2.84217094e-14 C55.8825877,-2.84217094e-14 38.8469239,16.5031579 38.8469239,36.9473684 L38.8469239,110.842105 C38.8469239,131.286316 55.8825877,147.789474 76.9864699,147.789474 Z"
					id="el_qhFcdAAFwo"
					fillRule="nonzero"
				/>
				<path
					d="M11.5,206.5 L142.5,12.5"
					id="el_M8X8g37WOI"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</g>
		</g>
	</svg>
);

export default MuteSvg;
