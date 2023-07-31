export interface ResultListProps {
		target?: string;
		href?: string;
		children: JSX.Element;
		small?: boolean;
		id?: string|number;
	}

declare function ResultList(props: ResultListProps): JSX.Element

export default ResultList;
