import React from 'react';
import { getClassName, handleA11yAction } from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';

import Button, { pagination } from '../../../styles/Button';

function getStartPage(totalPages, currentPage) {
	const midValue = parseInt(totalPages / 2, 10);
	const start = currentPage - midValue;
	return start > 1 ? start : 2;
}

export default function Pagination(props) {
	const start = getStartPage(props.pages, props.currentPage);
	const pages = [];

	const onPrevPage = (e) => {
		e.preventDefault();
		if (props.currentPage) {
			props.setPage(props.currentPage - 1);
		}
	};

	const onNextPage = (e) => {
		e.preventDefault();
		if (props.currentPage < props.totalPages - 1) {
			props.setPage(props.currentPage + 1);
		}
	};

	if (start <= props.totalPages) {
		const totalPagesToShow = props.pages < props.totalPages
			? (start + props.pages) - 1
			: props.totalPages + 1;

		for (let i = start; i < totalPagesToShow; i += 1) {
			const primary = props.currentPage === i - 1;
			const innerClassName = getClassName(props.innerClass, 'button');
			const className = innerClassName || primary
				? `${innerClassName} ${primary ? 'active' : ''}`
				: null;
			const pageBtn = (
				<Button
					className={className}
					primary={primary}
					key={i - 1}
					tabIndex="0"
					onKeyPress={event => handleA11yAction(event, () => props.setPage(i - 1))}
					onClick={(e) => {
						e.preventDefault();
						props.setPage(i - 1);
					}}
					href={`?${props.fragmentName}=${i}`}
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
	const className = innerClassName || primary
		? `${innerClassName} ${primary ? 'active' : ''}`
		: null;

	let prevHrefProp = {};
	let nextHrefProp = {};

	if (props.currentPage >= 1) {
		prevHrefProp = {
			href: `?${props.fragmentName}=${props.currentPage}`,
			rel: 'prev',
		};
	}

	if (props.currentPage < props.totalPages - 1) {
		nextHrefProp = {
			href: `?${props.fragmentName}=${props.currentPage + 2}`,
			rel: 'next',
		};
	}

	return (
		<div className={`${pagination} ${getClassName(props.innerClass, 'pagination')}`}>
			<Button
				className={getClassName(props.innerClass, 'button') || null}
				disabled={props.currentPage === 0}
				onKeyPress={event => handleA11yAction(event, onPrevPage)}
				onClick={onPrevPage}
				tabIndex="0"
				{...prevHrefProp}
			>
				Prev
			</Button>
			{
				<Button
					className={className}
					primary={primary}
					onKeyPress={event => handleA11yAction(event, () => props.setPage(0))}
					onClick={(e) => {
						e.preventDefault();
						props.setPage(0);
					}}
					tabIndex="0"
					href={`?${props.fragmentName}=1`}
				>
					1
				</Button>
			}
			{
				props.currentPage >= props.pages
					? <span>...</span>
					: null
			}
			{
				pages
			}
			<Button
				className={getClassName(props.innerClass, 'button') || null}
				disabled={props.currentPage >= props.totalPages - 1}
				onKeyPress={event => handleA11yAction(event, onNextPage)}
				onClick={onNextPage}
				tabIndex="0"
				{...nextHrefProp}
			>
				Next
			</Button>
		</div>
	);
}

Pagination.propTypes = {
	currentPage: types.number,
	innerClass: types.style,
	pages: types.number,
	setPage: types.func,
	totalPages: types.number,
	fragmentName: types.string,
};
