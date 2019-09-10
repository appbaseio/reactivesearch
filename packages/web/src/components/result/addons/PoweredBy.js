import React from 'react';

import { getClassName } from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';
import PoweredByImage from '../../../styles/PoweredByImage';
import Flex from '../../../styles/Flex';

class PoweredBy extends React.PureComponent {
	render() {
		if (this.props.show) {
			return (
				<Flex
					direction="row-reverse"
					className={getClassName(this.props.innerClass, 'poweredBy')}
				>
					<a href="https://appbase.io/" target="_blank" rel="noopener noreferrer">
						<PoweredByImage src="https://cdn.rawgit.com/appbaseio/cdn/d2ec210045e59104ee5485841fa17b23fc83f097/appbase/logos/rbc-logo.svg" />
					</a>
				</Flex>
			);
		}

		return null;
	}
}

PoweredBy.propTypes = {
	show: types.bool,
	innerClass: types.style,
};

export default PoweredBy;
