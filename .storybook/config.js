import { configure } from "@storybook/react";
import { setOptions } from "@storybook/addon-options";

setOptions({
	name: "reactivesearch",
	url: "https://github.com/appbaseio/reactivesearch",
	goFullScreen: false,
	showLeftPanel: true,
	showDownPanel: true,
	showSearchBox: false,
	downPanelInRight: false,
});

function loadStories() {
	require("../app/stories");
}

configure(loadStories, module);
