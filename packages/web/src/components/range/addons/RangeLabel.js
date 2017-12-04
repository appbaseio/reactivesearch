import React from "react";
import types from "@appbaseio/reactivecore/lib/utils/types";

import Label from "../../../styles/Label";

const RangeLabel = ({ align, children }) => (
	<Label align={align}>
		{children}
	</Label>
);

RangeLabel.propTypes = {
	align: types.rangeLabelsAlign,
	children: types.children
}

export default RangeLabel;
