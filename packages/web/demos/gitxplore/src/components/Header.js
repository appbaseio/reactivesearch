import React from "react";

import SearchFilters from "./SearchFilters";

import Navbar, { title } from "../styles/Navbar";

const Header = () => (
	<Navbar>
		<div className={title}>GitXplore</div>
		<SearchFilters />
	</Navbar>
);

export default Header;
