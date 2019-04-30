import React from 'react';
import { Link } from 'gatsby';

import { Spirit } from '../../../styles/spirit-styles';
import Icon from '../Icon';

const PrevNext = ({ prev, next }) => (
	<div className="grid-12">
		{prev ? (
			<Link
				to={prev.link}
				className="col-6 flex pa10 pl0 tdn justify-start items-center blue nudge-left--1 prevnext-hover ba b--transparent"
			>
				<Icon name="arrow-left" className="w5 h5 fill-blue" />
				<div className="ml4">
					{prev.group ? (
						<h6 className="ma0 pa0 f8 fw4 midgrey lh-1-5">{prev.group}</h6>
					) : null}
					<p className={`${Spirit.excerpt} nt1 di fw5`}>{prev.title}</p>
				</div>
			</Link>
		) : (
			<div className="col-6" />
		)}
		{next ? (
			<Link
				to={next.link}
				className="col-6 flex pr0 pa10 tdn justify-end items-center blue prevnext-hover ba b--transparent"
			>
				<div className="tr mr4">
					{next.group ? (
						<h6 className="ma0 pa0 f8 fw4 midgrey lh-1-5">{next.group}</h6>
					) : null}
					<p className={`${Spirit.excerpt} nt1 di fw5`}>{next.title}</p>
				</div>
				<Icon name="arrow-right" className="w5 h5 fill-blue" />
			</Link>
		) : (
			<div className="col-6" />
		)}
	</div>
);

export default PrevNext;
