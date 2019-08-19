import React from 'react';

import { getClassName, isEqual } from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';
import PoweredByImage from '../../../styles/PoweredByImage';
import Flex from '../../../styles/Flex';

const PoweredBy = props =>
	(props.show ? (
		<Flex direction="row-reverse" className={getClassName(props.innerClass, 'poweredBy')}>
			<a href="https://appbase.io/" target="_blank" rel="noopener noreferrer">
				<PoweredByImage src="https://cdn.rawgit.com/appbaseio/cdn/d2ec210045e59104ee5485841fa17b23fc83f097/appbase/logos/rbc-logo.svg" />
			</a>
		</Flex>
	) : null);

PoweredBy.propTypes = {
	show: types.number,
	innerClass: types.style,
};

function areEqual(prevProps, nextProps) {
	return isEqual(prevProps, nextProps);
}

export default React.memo(PoweredBy, areEqual);
