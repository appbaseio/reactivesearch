import React from "react";
import { Text } from "react-native";

import { storiesOf } from "@storybook/react-native";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";
import { text, boolean, number } from "@storybook/addon-knobs";

import TextFieldStory from "./TextFieldStory";

storiesOf("TextField", module)
	.add("Basic", () => (
		<TextFieldStory />
	))
	.add("With placeholder", () => (
		<TextFieldStory placeholder={text("placeholder", "Search Cars")} />
	))
