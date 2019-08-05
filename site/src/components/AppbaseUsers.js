import React from 'react';
import { css, cx } from 'react-emotion';
import { string, object, shape, arrayOf } from 'prop-types';
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
	title: 'ReactiveSearch is used by these awesome folks',
	imageConfig: [
		{
			srcSet:
				'../../reactivesearch/images/testimonials/dol/grey@1x.png 1x, ../../reactivesearch/images/testimonials/dol/grey@2x.png 2x,../../reactivesearch/images/testimonials/dol/grey@3x.png 3x',
			alt: 'US Department of Labor',
		},
		{
			srcSet:
				'../../reactivesearch/images/testimonials/fbresearch/grey@1x.png 1x, ../../reactivesearch/images/testimonials/fbresearch/grey@2x.png 2x,../../reactivesearch/images/testimonials/fbresearch/grey@3x.png 3x',
			alt: 'Facebook Research',
		},
		{
			srcSet:
				'../../reactivesearch/images/testimonials/rumbleon/rumbleon-grey@1x.png 1x, ../../reactivesearch/images/testimonials/rumbleon/rumbleon-grey@2x.png 2x,../../reactivesearch/images/testimonials/rumbleon/rumbleon-grey@3x.png 3x',
			alt: 'RumbleOn',
		},
		{
			srcSet:
				'../../reactivesearch/images/testimonials/betagov/logo@1x.png 1x, ../../reactivesearch/images/testimonials/betagov/logo@2x.png 2x,../../reactivesearch/images/testimonials/betagov/logo@3x.png 3x',
			alt: 'beta.gouv.fr',
		},
		{
			srcSet:
				'../../reactivesearch/images/testimonials/nasa/Nasa@1x.png 1x, ../../reactivesearch/images/testimonials/nasa/Nasa@2x.png 2x,../../reactivesearch/images/testimonials/nasa/Nasa@3x.png 3x',
			alt: 'Nasa',
		},
		{
			srcSet:
				'../../reactivesearch/images/testimonials/reactioncommerce/logo@1x.png 1x, ../../reactivesearch/images/testimonials/reactioncommerce/logo@2x.png 2x,../../reactivesearch/images/testimonials/reactioncommerce/logo@3x.png 3x',
			alt: 'ReactionCommerce',
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
	imageConfig: arrayOf(shape({
			srcSet: string,
			alt: string,
		})),
};

export default AppbaseUsers;
