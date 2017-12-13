import React from "react";
import PropTypes from "prop-types";

import SearchFilters from "./SearchFilters";

import Navbar, { title } from "../styles/Navbar";

const Header = ({ currentTopics }) => (
	<Navbar>
		<div className={title}>GitXplore</div>
		<SearchFilters currentTopics={currentTopics} />
	</Navbar>
);

Header.propTypes = {
	currentTopics: PropTypes.arrayOf(PropTypes.string)
};

export default Header;
