import { css } from "emotion";
import styled from "react-emotion";
import { darken, transitions } from "polished";

import theme from "./theme";

var filters = /*#__PURE__*/css("margin:8px -3px;a{margin:2px 3px;padding:5px 8px;font-size:0.85rem;position:relative;span:first-child{max-width:360px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-right:26px;}span:last-child{display:flex;height:100%;right:8px;position:absolute;align-items:center;border-left:1px solid #fff;padding-left:8px;margin-left:8px;}&:hover,&:focus{span:first-child{text-decoration:line-through;}}}");

var pagination = /*#__PURE__*/css("margin:10px -3px;text-align:center;a{margin:0 3px;}");

var primary = /*#__PURE__*/css("background-color:", theme.primaryColor, ";color:", theme.primaryTextColor, ";&:hover,&:focus{background-color:", darken(0.1, theme.primaryColor), ";}");

var disabled = /*#__PURE__*/css("background-color:#fafafa;color:#ccc\n\tcursor:not-allowed;&:hover,&:focus{background-color:#fafafa;}");

var Button = /*#__PURE__*/styled("a")("display:inline-flex;justify-content:center;align-items:center;border-radius:3px;min-height:30px;word-wrap:break-word;padding:5px 12px;line-height:1.2rem;background-color:#eee;color:#424242;cursor:pointer;user-select:none;", transitions("all 0.3s ease"), "\n\n\t&:hover,&:focus{background-color:#ccc;}", function (props) {
	return props.primary ? primary : null;
}, "\n\t", function (props) {
	return props.disabled ? disabled : null;
});

export { pagination, filters };
export default Button;