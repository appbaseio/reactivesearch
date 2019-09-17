import React from 'react';
import { getClassName, handleA11yAction } from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';

import Button, { pagination } from '../../../styles/Button';

function getStartPage(totalPages, currentPage, showEndPage) {
	const midValue = parseInt(totalPages / 2, 10);
	const start = currentPage - (showEndPage ? Math.ceil(midValue / 2) - 1 : midValue);
	return start > 1 ? start : 2;
}

const buildPaginationDOM = (props, position) => {
	const {
		pages,
		currentPage,
		setPage,
		totalPages,
		innerClass,
		fragmentName,
		showEndPage,
	} = props;
	let start
		= position === 'start'
			? getStartPage(pages, currentPage, showEndPage)
			: Math.ceil(totalPages - ((pages - 1) / 2)) + 1;
	const paginationButtons = [];
	if (start <= totalPages) {
		let totalPagesToShow = pages < totalPages ? start + (pages - 1) : totalPages + 1;
		if (showEndPage) {
			totalPagesToShow
				= position === 'start'
					? start + (Math.ceil(pages / 2) - (pages % 2))
					: totalPages + 1;
		}
		if (currentPage > (totalPages - pages) + 2) {
			start = (totalPages - pages) + 2;
		}
		if (totalPages <= pages) start = 2;
		for (let i = start; i < totalPagesToShow; i += 1) {
			const primary = currentPage === i - 1;
			const innerClassName = getClassName(innerClass, 'button');
			const className
				= innerClassName || primary ? `${innerClassName} ${primary ? 'active' : ''}` : null;
			const pageBtn = (
				<Button
					className={className}
					primary={primary}
					key={i - 1}
					tabIndex="0"
					onKeyPress={event => handleA11yAction(event, () => setPage(i - 1))}
					onClick={(e) => {
						e.preventDefault();
						setPage(i - 1);
					}}
					alt={`Page ${i}`}
					href={`?${fragmentName}=${i}`}
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

class Pagination extends React.PureComponent {
	render() {
		const {
			pages,
			currentPage,
			setPage,
			totalPages,
			innerClass,
			fragmentName,
			showEndPage,
		} = this.props;
		if (!totalPages) {
			return null;
		}

		const onPrevPage = (e) => {
			e.preventDefault();
			if (currentPage) {
				setPage(currentPage - 1);
			}
		};

		const onNextPage = (e) => {
			e.preventDefault();
			if (currentPage < totalPages - 1) {
				setPage(currentPage + 1);
			}
		};

		const innerClassName = getClassName(innerClass, 'button');
		const primary = currentPage === 0;
		const className
			= innerClassName || primary ? `${innerClassName} ${primary ? 'active' : ''}` : null;

		let prevHrefProp = {};
		let nextHrefProp = {};

		if (currentPage >= 1) {
			prevHrefProp = {
				href: `?${fragmentName}=${currentPage}`,
				alt: `Page ${currentPage}`,
				rel: 'prev',
			};
		}

		if (currentPage < totalPages - 1) {
			nextHrefProp = {
				href: `?${fragmentName}=${currentPage + 2}`,
				rel: 'next',
				alt: `Page ${currentPage + 2}`,
			};
		}
		return (
			<div className={`${pagination} ${getClassName(innerClass, 'pagination')}`}>
				<Button
					className={getClassName(innerClass, 'button') || null}
					disabled={currentPage === 0}
					onKeyPress={event => handleA11yAction(event, onPrevPage)}
					onClick={onPrevPage}
					tabIndex={currentPage === 0 ? '-1' : '0'}
					{...prevHrefProp}
				>
					Prev
				</Button>
				{
					<Button
						className={className}
						primary={primary}
						onKeyPress={event => handleA11yAction(event, () => setPage(0))}
						onClick={(e) => {
							e.preventDefault();
							setPage(0);
						}}
						tabIndex="0"
						href={`?${fragmentName}=1`}
						alt="Page 1"
					>
						1
					</Button>
				}
				{showEndPage && currentPage >= Math.floor(pages / 2) + !!(pages % 2) ? (
					<span>...</span>
				) : null}
				{(currentPage <= (totalPages - pages) + 2 || totalPages <= pages) && buildPaginationDOM(this.props, 'start')}
				{showEndPage && pages > 2 && currentPage <= totalPages - Math.ceil(pages * 0.75) ? (
					<span>...</span>
				) : null}
				{showEndPage && buildPaginationDOM(this.props, 'end')}
				<Button
					className={getClassName(innerClass, 'button') || null}
					disabled={currentPage >= totalPages - 1}
					onKeyPress={event => handleA11yAction(event, onNextPage)}
					onClick={onNextPage}
					tabIndex={currentPage >= totalPages - 1 ? '-1' : '0'}
					{...nextHrefProp}
				>
					Next
				</Button>
			</div>
		);
	}
}

Pagination.propTypes = {
	currentPage: types.number,
	innerClass: types.style,
	pages: types.number,
	setPage: types.func,
	totalPages: types.number,
	fragmentName: types.string,
	showEndPage: types.bool,
};

export default Pagination;
