import React from "react";
import { Text } from "react-native";

import { storiesOf } from "@storybook/react-native";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";
import { text, boolean, number, select, array, object } from "@storybook/addon-knobs";

import DataControllerStory from "./DataControllerStory";
import DataSearchStory from "./DataSearchStory";
import TextFieldStory from "./TextFieldStory";
import SingleDropdownListStory from "./SingleDropdownListStory";
import MultiDropdownListStory from "./MultiDropdownListStory";
import SingleDropdownRangeStory from "./SingleDropdownRangeStory";
import MultiDropdownRangeStory from "./MultiDropdownRangeStory";
import RangeSliderStory from "./RangeSliderStory";
import DatePickerStory from "./DatePickerStory";

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

storiesOf("DataSearch", module)
	.add("Basic", () => (
		<DataSearchStory />
	))
	.add("with placeholder", () => (
		<DataSearchStory placeholder={text("placeholder", "Find fast cars")} />
	))
	.add("with defaultSelected", () => (
		<DataSearchStory
			defaultSelected={text("defaultSelected", "BMW")}
		/>
	))
	.add("with highlight", () => (
		<DataSearchStory
			highlight={boolean("highlight", true)}
			highlightField={select("highlightField", ["name", "brand", "model"], "name")}
		/>
	))
	.add("with fieldWeights as [1, 2, 3]", () => (
		<DataSearchStory fieldWeights={[1, 2, 3]} />
	))
	.add("with queryFormat", () => (
		<DataSearchStory queryFormat={select("queryFormat", { and: "and", or: "or" }, "and")} />
	))
	.add("with fuzziness as a number", () => (
		<DataSearchStory fuzziness={number("fuzziness (0, 1 or 2)", 1)} />
	))
	.add("with fuzziness as AUTO", () => (
		<DataSearchStory fuzziness={text("fuzziness ('AUTO')", "AUTO")} />
	))
	.add("without autoSuggest", () => (
		<DataSearchStory autoSuggest={boolean("autoSuggest", false)} />
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

storiesOf("SingleDropdownList", module)
	.add("Basic", () => (
		<SingleDropdownListStory />
	))
	.add("with placeholder", () => (
		<SingleDropdownListStory placeholder={text("placeholder", "Pick Car Brand")} />
	))
	.add("with defaultSelected", () => (
		<SingleDropdownListStory defaultSelected={text("defaultSelected", "porsche")} />
	))
	.add("with sortBy", () => (
		<SingleDropdownListStory sortBy={select("sortBy", ["count", "asc", "desc"], "desc")} />
	));

storiesOf("MultiDropdownList", module)
	.add("Basic", () => (
		<MultiDropdownListStory />
	))
	.add("with placeholder", () => (
		<MultiDropdownListStory placeholder={text("placeholder", "Pick Car Brand")} />
	))
	.add("with defaultSelected", () => (
		<MultiDropdownListStory defaultSelected={array("defaultSelected", ["porsche", "bmw"])} />
	))
	.add("with sortBy", () => (
		<MultiDropdownListStory sortBy={select("sortBy", ["count", "asc", "desc"], "desc")} />
	));

storiesOf("SingleDropdownRange", module)
	.add("Basic", () => (
		<SingleDropdownRangeStory />
	))
	.add("with placeholder", () => (
		<SingleDropdownRangeStory placeholder={text("placeholder", "Pick Category")} />
	))
	.add("with defaultSelected", () => (
		<SingleDropdownRangeStory defaultSelected={text("defaultSelected", "First Date")} />
	));

storiesOf("MultiDropdownRange", module)
	.add("Basic", () => (
		<MultiDropdownRangeStory />
	))
	.add("with placeholder", () => (
		<MultiDropdownRangeStory placeholder={text("placeholder", "Pick Category")} />
	))
	.add("with defaultSelected", () => (
		<MultiDropdownRangeStory defaultSelected={array("defaultSelected", ["First Date", "Pricey"])} />
	));

storiesOf("RangeSlider", module)
	.add("Basic", () => (
		<RangeSliderStory
			range={{
				start: 0,
				end: 5
			}}
		/>
	))
	.add("with range", () => (
		<RangeSliderStory
			range={object("range", {
				start: 0,
				end: 5
			})}
		/>
	))
	.add("with defaultSelected", () => (
		<RangeSliderStory
			range={{
				start: 0,
				end: 5
			}}
			defaultSelected={object("defaultSelected", {
				start: 1,
				end: 3
			})}
		/>
	))
	.add("without histogram", () => (
		<RangeSliderStory
			range={{
				start: 0,
				end: 5
			}}
			showHistogram={boolean("showHistogram", false)}
		/>
	))
	.add("with interval", () => (
		<RangeSliderStory
			range={{
				start: 0,
				end: 5
			}}
			interval={number("interval", 1)}
		/>
	))
	.add("with stepValue", () => (
		<RangeSliderStory
			range={{
				start: 0,
				end: 5
			}}
			stepValue={number("stepValue", 1)}
		/>
	));

storiesOf("DatePicker", module)
	.add("Basic", () => (
		<DatePickerStory startDate="2017-01-01" />
	))
