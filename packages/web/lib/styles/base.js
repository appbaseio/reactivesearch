import styled from "react-emotion";

var Base = /*#__PURE__*/styled("div")("font-family:", function (props) {
	return props.theme.fontFamily;
}, ";font-size:", function (props) {
	return props.theme.fontSize;
}, ";*,*:before,*:after{box-sizing:border-box;}");

export default Base;