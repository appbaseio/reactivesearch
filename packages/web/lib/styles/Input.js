import { css } from "emotion";
import styled from "react-emotion";

var input = /*#__PURE__*/css("width:100%;height:42px;padding:8px;border:1px solid #ccc;background-color:#fff;font-size:0.9rem;outline:none;");

var Input = /*#__PURE__*/styled("input")(input);

var suggestions = /*#__PURE__*/css("display:block;width:100%;border:1px solid #ccc;background-color:#fff;font-size:0.9rem;z-index:2;position:relative;top:-1px;ul{margin:0;padding:0;list-style:none;max-height:260px;overflow-y:auto;li{cursor:pointer;padding:10px;&:hover,&:focus{background-color:#eee;}}}");

export default Input;
export { input, suggestions };