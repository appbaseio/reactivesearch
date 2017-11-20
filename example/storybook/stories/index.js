import React from "react";
import { Text } from "react-native";

import { storiesOf } from "@storybook/react-native";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";
import { text, boolean, number } from "@storybook/addon-knobs";

import DataControllerStory from "./DataControllerStory";
import TextFieldStory from "./TextFieldStory";

storiesOf("DataController", module)
	.add("Basic", () => (
		<DataControllerStory />
	))
	.add("with defaultSelected and customQuery", () => (
		<DataControllerStory
			defaultSelected={text("defaultSelected", "BMW")}
			customQuery={(value) => ({
				bool: {
					must: {
						match: {
							brand: value
						}
					}
				}
			})}
		/>
	));

storiesOf("TextField", module)
	.add("Basic", () => (
		<TextFieldStory />
	))
	.add("With placeholder", () => (
		<TextFieldStory placeholder={text("placeholder", "Search Cars")} />
	))
	.add("With defaultSelected", () => (
		<TextFieldStory defaultSelected={text("defaultSelected", "BMW")} />
	));
