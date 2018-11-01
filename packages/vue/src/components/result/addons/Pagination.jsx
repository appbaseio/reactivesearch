import { helper } from '@appbaseio/reactivecore';
import Button, { pagination } from '../../../styles/Button';
import types from '../../../utils/vueTypes';

const { getClassName, handleA11yAction } = helper;
function getStartPage(totalPages, currentPage) {
	const midValue = parseInt(totalPages / 2, 10);
	const start = currentPage - midValue;
	return start > 1 ? start : 2;
}
const Pagination = {
	name: 'Pagination',
	functional: true,
	props: {
		currentPage: types.number,
		innerClass: types.style,
		pages: types.number,
		setPage: types.func,
		totalPages: types.number
	},
	render(createElement, context) {
		const { props } = context;
		const start = getStartPage(props.pages, props.currentPage);
		const pages = [];

		const onPrevPage = () => {
			if (props.currentPage) {
				props.setPage(props.currentPage - 1);
			}
		};

		const onNextPage = () => {
			if (props.currentPage < props.totalPages - 1) {
				props.setPage(props.currentPage + 1);
			}
		};

		if (start <= props.totalPages) {
			const calcPages = start + props.pages;
			// eslint-disable-next-line
			const totalPagesToShow =
				props.pages < props.totalPages ? calcPages - 1 : props.totalPages + 1;
			for (let i = start; i < totalPagesToShow; i += 1) {
				const primary = props.currentPage === i - 1;
				const innerClassName = getClassName(props.innerClass, 'button');
				const className
					= innerClassName || primary
						? `${innerClassName} ${primary ? 'active' : ''}`
						: '';
				const pageBtn = (
					<Button
						class={className}
						primary={primary}
						key={i - 1}
						tabIndex="0"
						onKeyPress={event =>
							handleA11yAction(event, () => props.setPage(i - 1))
						}
						onClick={() => props.setPage(i - 1)}
					>
						{i}
					</Button>
				);

				if (i <= props.totalPages + 1) {
					pages.push(pageBtn);
				}
			}
		}

		if (!props.totalPages) {
			return null;
		}

		const innerClassName = getClassName(props.innerClass, 'button');
		const primary = props.currentPage === 0;
		const className
			= innerClassName || primary
				? `${innerClassName} ${primary ? 'active' : ''}`
				: '';
		return (
			<div
				class={`${pagination} ${getClassName(props.innerClass, 'pagination')}`}
			>
				<Button
					class={getClassName(props.innerClass, 'button') || ''}
					disabled={props.currentPage === 0}
					onKeyPress={event => handleA11yAction(event, onPrevPage)}
					onClick={onPrevPage}
					tabIndex="0"
				>
					Prev
				</Button>
				{
					<Button
						class={className}
						primary={primary}
						onKeyPress={event =>
							handleA11yAction(event, () => props.setPage(0))
						}
						onClick={() => props.setPage(0)}
						tabIndex="0"
					>
						1
					</Button>
				}
				{props.currentPage >= props.pages ? <span>...</span> : null}
				{pages}
				<Button
					class={getClassName(props.innerClass, 'button') || ''}
					disabled={props.currentPage >= props.totalPages - 1}
					onKeyPress={event => handleA11yAction(event, onNextPage)}
					onClick={onNextPage}
					tabIndex="0"
				>
					Next
				</Button>
			</div>
		);
	}
};
Pagination.install = function(Vue) {
	Vue.component(Pagination.name, Pagination);
};
export default Pagination;
