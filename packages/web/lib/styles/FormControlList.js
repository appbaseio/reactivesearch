import { css } from "emotion";
import styled from "react-emotion";
import { lighten } from "polished";

import theme from "./theme";

var item = {
	width: "16px",
	height: "16px",
	scale: "4px"
};

var vh = /*#__PURE__*/css("border:0;clip:rect(1px,1px,1px,1px);clip-path:inset(50%);height:1px;overflow:hidden;padding:0;position:absolute;width:1px;white-space:nowrap;");

var hideInputControl = /*#__PURE__*/css("+ label{padding-left:0;&::before,&::after{width:0;height:0;border:0;margin:0;visibility:hidden;}}&:checked{+ label{font-weight:bold;}}");

var formItem = /*#__PURE__*/css(vh, ";&:focus{+ label{&::before{box-shadow:0 0 0 2px ", lighten(0.4, theme.primaryColor), ";}}}&:hover{+ label{&::before{border-color:", theme.primaryColor, ";}}}&:active{+ label{&::before{transition-duration:0;}}}+ label{position:relative;user-select:none;display:flex;width:100%;height:100%;align-items:center;cursor:pointer;&::before{background-color:#fff;border:2px solid ", lighten(0.2, theme.textColor), ";box-sizing:content-box;content:\"\";color:", theme.primaryColor, ";margin-right:calc(", item.width, " * 0.5);top:50%;left:0;width:", item.width, ";height:", item.height, ";display:inline-block;vertical-align:middle;}&::after{box-sizing:content-box;content:\"\";background-color:", theme.primaryColor, ";position:absolute;top:50%;left:calc(2px + ", item.scale, "/2);width:calc(", item.width, " - ", item.scale, ");height:calc(", item.height, " - ", item.scale, ");margin-top:calc(", item.height, "/-2 - ", item.scale, "/-2);transform:scale(0);transform-origin:50%;transition:transform 200ms ease-out;}}");

var Radio = /*#__PURE__*/styled("input")(formItem, ";", function (props) {
	return props.show ? null : hideInputControl;
}, ";+ label{&::before,&::after{border-radius:50%;}}&:checked{&:active,&:focus{+ label{color:", theme.primaryColor, ";&::before{animation:none;filter:none;transition:none;}}}+ label{&::before{animation:none;background-color:#fff;border-color:", theme.primaryColor, ";}&::after{transform:scale(1);}}");

Radio.defaultProps = {
	type: "radio"
};

var Checkbox = /*#__PURE__*/styled("input")(formItem, ";", function (props) {
	return props.show ? null : hideInputControl;
}, ";+ label{&::before,&::after{border-radius:0;}&::after{background-color:transparent;top:50%;left:calc(2px + ", item.width, "/5);width:calc(", item.width, " / 2);height:calc(", item.width, " / 5);margin-top:calc(", item.height, " / -2 / 2 * 0.8);border-style:solid;border-color:", theme.primaryColor, ";border-width:0 0 2px 2px;border-radius:0;border-image:none;transform:rotate(-45deg) scale(0);transition:none;}}&:checked{+ label{&::before{border-color:", theme.primaryColor, ";}&::after{content:\"\";transform:rotate(-45deg) scale(1);transition:transform 200ms ease-out;}}}");

Checkbox.defaultProps = {
	type: "checkbox"
};

var FormControlList = /*#__PURE__*/css("list-style:none;padding:0;margin:0;max-height:", theme.componentMaxHeight, ";position:relative;overflow-y:scroll;padding-bottom:12px;li{height 30px;display:flex;flex-direction:row;align-items:center;padding-left:2px;}");

export { FormControlList, Radio, Checkbox };