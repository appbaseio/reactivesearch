import React from "react";

import SearchFilters from "./SearchFilters";

import Navbar from "../styles/Navbar";

const Header = () => (
	<Navbar>
		GitXplore
		<SearchFilters />
	</Navbar>
);

export default Header;
