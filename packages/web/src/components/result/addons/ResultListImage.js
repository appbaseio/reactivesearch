import React from 'react';
import types from '@appbaseio/reactivecore/lib/utils/types';
import { Image } from '../../../styles/ListItem';

const ResultListImage = ({ src, small, ...props }) => <Image src={src} small={small} {...props} />;
ResultListImage.propTypes = {
	src: types.stringRequired,
	small: types.bool,
};
ResultListImage.defaultProps = {
	small: false,
};

export default ResultListImage;
