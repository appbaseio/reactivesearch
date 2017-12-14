import React, { Fragment } from "react";
import types from "@appbaseio/reactivecore/lib/utils/types";

import Card, { Title } from "../../../styles/Card";

const ResultHighlight = ({ result }) => (
	<Fragment>
		{typeof result.title === "string" ? (
			<Title dangerouslySetInnerHTML={{ __html: result.title }} />
		) : (
			<Title>{result.title}</Title>
		)}
		{typeof result.desc === "string" ? (
			<article dangerouslySetInnerHTML={{ __html: result.desc }} />
		) : (
			<article>{result.desc}</article>
		)}
	</Fragment>
);

ResultHighlight.propTypes = {
	result: types.props
}

export default ResultHighlight;
