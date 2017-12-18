import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "emotion-theming";

import HomePage from "./pages/HomePage";

ReactDOM.render(
	<ThemeProvider theme={{ fontFamily: "Rubik", primaryColor: "#EC80DB" }}>
		<HomePage />
	</ThemeProvider>,
	document.getElementById("root")
);
