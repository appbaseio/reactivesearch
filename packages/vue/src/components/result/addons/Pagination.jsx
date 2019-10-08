import { helper } from '@appbaseio/reactivecore';
import Button, { pagination } from '../../../styles/Button';
import types from '../../../utils/vueTypes';

const { getClassName, handleA11yAction } = helper;
function getStartPage(totalPages, currentPage, showEndPage) {
	const midValue = parseInt(totalPages / 2, 10);
	const start = currentPage - (showEndPage ? Math.ceil(midValue / 2) - 1 : midValue);
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
		totalPages: types.number,
		showEndPage: types.bool,
	},
	render(createElement, context) {
		const { props } = context;

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

		if (!props.totalPages) {
			return null;
		}

		const innerClassName = getClassName(props.innerClass, 'button');
		const primary = props.currentPage === 0;
		const className
			= innerClassName || primary ? `${innerClassName} ${primary ? 'active' : ''}` : '';

		const buildPaginationDOM = position => {
			const { pages, currentPage, totalPages, setPage, showEndPage } = props;
			let start
				= position === 'start'
					? getStartPage(pages, currentPage, showEndPage)
					: Math.ceil(totalPages - (pages - 1) / 2) + 1;
			const paginationButtons = [];
			if (start <= totalPages) {
				let totalPagesToShow = pages < totalPages ? start + (pages - 1) : totalPages + 1;
				if (showEndPage) {
					totalPagesToShow
						= position === 'start'
							? start + (Math.ceil(pages / 2) - (pages % 2))
							: totalPages + 1;
				}
				if (currentPage > totalPages - pages + 2) {
					start = totalPages - pages + 2;
				}
				if (totalPages <= pages) start = 2;
				for (let i = start; i < totalPagesToShow; i += 1) {
					const activeButton = currentPage === i - 1;
					const classNameBtn
						= innerClassName || activeButton
							? `${innerClassName} ${activeButton ? 'active' : ''}`
							: '';

					const pageBtn = (
						<Button
							class={classNameBtn}
							primary={activeButton}
							tabIndex="0"
							onKeyPress={event => handleA11yAction(event, () => setPage(i - 1))}
							alt={`page-${i}`}
							onClick={() => setPage(i - 1)}
						>
							{i}
						</Button>
					);
					if (i <= totalPages + 1) {
						paginationButtons.push(pageBtn);
					}
				}
			}
			return paginationButtons;
		};

		return (
			<div class={`${pagination} ${getClassName(props.innerClass, 'pagination')}`}>
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
						onKeyPress={event => handleA11yAction(event, () => props.setPage(0))}
						onClick={() => props.setPage(0)}
						tabIndex="0"
					>
						1
					</Button>
				}
				{props.showEndPage
				&& props.currentPage >= Math.floor(props.pages / 2) + !!(props.pages % 2) ? (
						<span>...</span>
					) : null}
				{(props.currentPage <= props.totalPages - props.pages + 2
					|| props.totalPages <= props.pages)
					&& buildPaginationDOM('start')}
				{props.showEndPage
				&& props.pages > 2
				&& props.currentPage <= props.totalPages - Math.ceil(props.pages * 0.75) ? (
						<span>...</span>
					) : null}
				{props.showEndPage && buildPaginationDOM('end')}
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
	},
};
Pagination.install = function(Vue) {
	Vue.component(Pagination.name, Pagination);
};
export default Pagination;
