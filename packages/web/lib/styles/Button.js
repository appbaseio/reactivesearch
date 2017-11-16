import { css } from "emotion";
import styled from "react-emotion";
import { darken, transitions } from "polished";

import theme from "./theme";

var pagination = /*#__PURE__*/css("margin:10px -3px;text-align:center;");

var primary = /*#__PURE__*/css("background-color:", theme.primaryColor, ";color:", theme.primaryTextColor, ";&:hover,&:focus{background-color:", darken(0.1, theme.primaryColor), ";}");

var disabled = /*#__PURE__*/css("background-color:#fafafa;color:#ccc\n\tcursor:not-allowed;&:hover,&:focus{background-color:#fafafa;}");

var Button = /*#__PURE__*/styled("a")("display:inline-flex;justify-content:center;align-items:center;border-radius:3px;height:30px;padding:0 12px;background-color:#eee;color:#424242;cursor:pointer;user-select:none;", transitions("all 0.3s ease"), "\n\n\t&:hover,&:focus{background-color:#ccc;}", function (props) {
	return props.primary ? primary : null;
}, "\n\t", function (props) {
	return props.disabled ? disabled : null;
}, "\n\n\t", pagination, " &{margin:0 3px;}");

export { pagination };
export default Button;