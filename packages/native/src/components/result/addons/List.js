import React, { Component } from 'react';
import { FlatList } from 'react-native';

import { isEqual, getInnerKey } from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';

class List extends Component {
	shouldComponentUpdate(nextProps) {
		if (!isEqual(this.props.data, nextProps.data)) {
			return true;
		}
		return false;
	}

	render() {
		return (
			<FlatList
				ref={node => this.props.setRef(node)}
				style={{ width: '100%' }}
				data={this.props.data || []}
				keyExtractor={item => item._id}
				renderItem={({ item }) => this.props.onData(item)}
				onEndReachedThreshold={0.5}
				onEndReached={this.props.onEndReached}
				{...getInnerKey(this.props.innerProps, 'flatList')}
			/>
		);
	}
}

List.propTypes = {
	data: types.data,
	setRef: types.func,
	onData: types.func,
	onEndReached: types.func,
	innerProps: types.props,
};

export default List;
