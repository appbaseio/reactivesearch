import { css } from "emotion";
import styled from "react-emotion";

import theme from "./theme";

var item = {
	width: "20px",
	height: "20px",
	scale: "6px"
};

var vh = /*#__PURE__*/css("border:0;clip:rect(1px,1px,1px,1px);clip-path:inset(50%);height:1px;overflow:hidden;padding:0;position:absolute;width:1px;white-space:nowrap;");

var formItem = /*#__PURE__*/css(vh, ";&:focus{+ label{&::before{box-shadow:0 0 0 2px rgba(", theme.primaryColor, ",0.4) !important;}}}&:hover{+ label{&::before{border-color:", theme.primaryColor, ";}}}&:active{+ label{&::before{transition-duration:0;}}}+ label{position:relative;padding:5px;user-select:none;&::before{background-color:#fff;border:1px solid ", theme.primaryColor, ";box-sizing:content-box;content:\"\";color:", theme.primaryColor, ";margin-right:", item.width, " * 0.25;top:50%;left:0;width:", item.width, ";height:", item.height, ";display:inline-block;vertical-align:middle;}&::after{box-sizing:content-box;content:\"\";background-color:", theme.primaryColor, ";position:absolute;top:50%;left:6px + ", item.scale, "/2;width:", item.width, " - ", item.scale, ";height:", item.height, " - ", item.scale, ";margin-top:(", item.height, " - ", item.scale, ")/-2;transform:scale(0);transform-origin:50%;transition:transform 200ms ease-out;}}");