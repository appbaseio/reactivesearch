import React, { Component } from "react";
import { CategorySearch } from "@appbaseio/reactivesearch";

import SearchFilters from "./SearchFilters";

import Navbar, { title } from "../styles/Navbar";
import Flex, { FlexChild } from "../styles/Flex";
import { categorySearchContainer } from "../styles/Container";

class Header extends Component {
	render() {
		return (
			<Navbar>
				<Flex
					alignCenter
					responsive
					justifyContent="space-between"
				>
					<FlexChild className={title}>Car Store</FlexChild>
					<FlexChild flex={1} className={categorySearchContainer}>
						<CategorySearch
							dataField="name"
							categoryField="brand.raw"
							componentId="category"
							placeholder="Search for cars..."
							react={{
								and: "brand"
							}}
						/>
					</FlexChild>
				</Flex>
			</Navbar>
		);
	}
}

export default Header;
