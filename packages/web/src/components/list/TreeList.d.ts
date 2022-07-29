import * as React from 'react';

import { CommonProps } from '../..';
import * as types from '../../types';

export interface TreeListProps extends CommonProps {
	componentId: string;
	className?: string;
	style?: types.style;
	showRadio?: boolean;
	showCheckbox?: boolean;
	mode: 'single' | 'multiple';
	showCount?: boolean;
	showSearch?: boolean;
	showIcon?: boolean;
	icon: types.children;
	showLeafIcon?: boolean;
	leafIcon: types.children;
	showLine?: boolean;
	switcherIcon: (expanded: boolean) => types.children;
	render?: (data: any) => any;
	renderItem: (item: any, count?: number, isSelected?: boolean) => any;
}

declare const TreeList: React.ComponentClass<TreeListProps>;

export default TreeList;
