import { css } from "emotion";
import theme from "./theme";

var base = /*#__PURE__*/css("font-family:", theme.fontFamily, ";font-size:", theme.fontSize, ";");

export { base };
export * from "./Button";
export * from "./Input";