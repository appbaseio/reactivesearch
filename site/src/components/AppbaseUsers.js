import React from 'react';
import { css, cx } from 'react-emotion';
import {
 string, object, shape, arrayOf,
} from 'prop-types';
import { media } from '../utils';
import SubHeading from './SubHeading';

const styles = css`
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
	margin: 20px 0 80px 0;
	img {
		max-width: 20%;
		margin: 20px;
		${media.medium(css`
			max-width: 30%;
			margin: 30px 5px;
		`)};
	}
`;

const headingCls = css({
	maxWidth: '900px',
	fontWeight: '600',
	fontSize: '24px',
	padding: '10px',
	color: '#232E44',
	textAlign: 'center',
	margin: '80px auto 0 auto',
});

const AppbaseUsers = ({
 className, style, imageConfig, imageStyle, title,
}) => (
	<React.Fragment>
		{title && <SubHeading css={headingCls}>{title}</SubHeading>}
		<div className={cx(styles, className)} style={style}>
			{imageConfig.map((image, index) => (
				<img
					style={imageStyle}
					// eslint-disable-next-line
					key={index}
					srcSet={image.srcSet}
					alt={image.alt}
				/>
			))}
		</div>
	</React.Fragment>
);
AppbaseUsers.defaultProps = {
	title: 'You are in good company',
	imageConfig: [
		{
			srcSet:
				'../../reactivesearch/images/testimonials/kwiat/kwiat-grey@1x.png 1x, ../../reactivesearch/images/testimonials/kwiat/kwiat-grey@2x.png 2x,../../reactivesearch/images/testimonials/kwiat/kwiat-grey@3x.png 3x',
			alt: 'Kwiat',
		},
		{
			srcSet:
				'../../reactivesearch/images/testimonials/rumbleon/rumbleon-grey@1x.png 1x, ../../reactivesearch/images/testimonials/rumbleon/rumbleon-grey@2x.png 2x,../../reactivesearch/images/testimonials/rumbleon/rumbleon-grey@3x.png 3x',
			alt: 'RumbleOn',
		},
		{
			srcSet:
				'../../reactivesearch/images/testimonials/inquisithealth/inquisithealth-grey@2x.png 1x, ../../reactivesearch/images/testimonials/inquisithealth/inquisithealth-grey@2x.png 2x,../../reactivesearch/images/testimonials/inquisithealth/inquisithealth-grey@3x.png 3x',
			alt: 'InquisitHealth',
		},
		{
			srcSet:
				'../../reactivesearch/images/testimonials/hiredb/hiredb-grey@1x.png 1x, ../../reactivesearch/images/testimonials/hiredb/hiredb-grey@2x.png 2x,../../reactivesearch/images/testimonials/hiredb/hiredb-grey@3x.png 3x',
			alt: 'hiredb',
		},
		{
			srcSet:
				'../../reactivesearch/images/testimonials/shopelect/shopelect-grey@1x.png 1x, ../../reactivesearch/images/testimonials/shopelect/shopelect-grey@2x.png 2x,../../reactivesearch/images/testimonials/shopelect/shopelect-grey@3x.png 3x',
			alt: 'shopelect',
		},
		{
			srcSet:
				'../../reactivesearch/images/testimonials/lyearn/lyearn-grey@1x.png 1x, ../../reactivesearch/images/testimonials/lyearn/lyearn-grey@2x.png 2x,../../reactivesearch/images/testimonials/lyearn/lyearn-grey@3x.png 3x',
			alt: 'lyearn',
		},
	],
	className: null,
	style: null,
	imageStyle: null,
};
AppbaseUsers.propTypes = {
	title: string,
	className: string,
	style: object,
	imageStyle: object,
	imageConfig: arrayOf(
		shape({
			srcSet: string,
			alt: string,
		}),
	),
};

export default AppbaseUsers;
