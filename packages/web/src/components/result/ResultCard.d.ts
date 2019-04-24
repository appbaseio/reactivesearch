import * as React from 'react';
import * as types from '../../types';

declare namespace ResultCardTree {
	interface ResultCardProps {
		target?: string;
		children: React.ReactNode;
		href?: string;
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
		static Image: React.ComponentType<ImageProps>;
		static Title: React.ComponentType<TitleProps>;
		static Description: React.ComponentType<DescriptionProps>;
	}
}

export default ResultCardTree.ResultCard;
