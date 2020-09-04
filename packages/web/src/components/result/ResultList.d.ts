import * as React from 'react';
import { CommonProps } from '../../';
import * as types from '../../types';

declare namespace ResultListTree {
	interface ResultListProps {
		target?: string;
		href?: string;
		children: React.ReactNode;
		small?: boolean;
		id?: string|number;
	}

	interface ImageProps extends React.HTMLAttributes<HTMLDivElement> {
		src: string;
		small?: boolean;
	}

	interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
		children?: React.ReactNode;
	}
	interface DescriptionProps extends React.HTMLAttributes<HTMLDivElement> {
		children?: React.ReactNode;
	}

	class ResultList extends React.Component<ResultListProps, any> {
		static Image: React.ComponentClass<ImageProps>;
		static Content: React.ComponentClass<DescriptionProps>;
		static Title: React.ComponentClass<TitleProps>;
		static Description: React.ComponentClass<DescriptionProps>;
	}
}

export default ResultListTree.ResultList;
