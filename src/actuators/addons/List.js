import React, { Component } from "react";
import { FlatList } from "react-native";

import { isEqual } from "@appbaseio/reactivecore/lib/utils/helper";

export default class List extends Component {
	shouldComponentUpdate(nextProps) {
		if (!isEqual(this.props.data, nextProps.data)) {
			return true;
		}
		return false;
	}

	render() {
		return (<FlatList
			ref={node => this.props.setRef(node)}
			style={{ width: "100%" }}
			data={this.props.data || []}
			keyExtractor={(item) => item._id}
			renderItem={({ item }) => this.props.onData(item)}
			onEndReachedThreshold={0.5}
			onEndReached={this.props.onEndReached}
		/>)
	}
}
