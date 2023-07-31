export interface ResultCardProps {
	target?: string;
	children: JSX.Element;
	href?: string;
	id?: string|number;
}

declare function ResultCard(props: ResultCardProps): JSX.Element;

export default ResultCard;
