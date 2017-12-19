import React from "react";
import { ResultCard } from "@appbaseio/reactivesearch";
import PropTypes from "prop-types";

import ResultItem, { resultListContainer, resultCardHeader } from "../styles/ResultItem";
import Flex from "../styles/Flex";
import Button from "../styles/Button";

const onResultStats = (results, time) => (
	<Flex justifyContent="flex-end" style={{ marginTop: "0.6rem" }}>
		{results} results found in {time}ms
	</Flex>
);

const onData = ({ _source: data }) => ({
	image: data.vehicleType === "other" || data.vehicleType === "unknown" ?
		"src/images/car.jpg" :
		`src/images/${data.vehicleType.replace(/ /g, "-")}/${data.color}.jpg`,
	title: data.name,
	desc: data.model
});

const Results = () => (
	<ResultCard
		componentId="results"
		dataField="name"
		onData={onData}
		onResultStats={onResultStats}
		react={{
			and: ["category", "brand", "rating", "vehicle", "price"]
		}}
		innerClass={{
			image: "card-image",
			pagination: "pagination"
		}}
		pagination
		size={9}
	/>
);

onData.propTypes = {
	_source: PropTypes.object // eslint-disable-line
};

export default Results;
