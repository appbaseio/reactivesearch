import * as React from 'react';
import * as types from '../../types';

declare namespace ResultCardTree {
	interface ResultCardProps {
		target?: string;
		children: React.ReactNode;
		href?: string;
		id?: string|number;
	}

	interface ImageProps extends React.HTMLAttributes<HTMLDivElement> {
		src: string;
	}

	interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
		children?: React.ReactNode;
	}
	interface DescriptionProps extends React.HTMLAttributes<HTMLDivElement> {
		children?: React.ReactNode;
	}

	class ResultCard extends React.Component<ResultCardProps, any> {
		static Image: React.ComponentClass<ImageProps>;
		static Title: React.ComponentClass<TitleProps>;
		static Description: React.ComponentClass<DescriptionProps>;
	}
}

export default ResultCardTree.ResultCard;
