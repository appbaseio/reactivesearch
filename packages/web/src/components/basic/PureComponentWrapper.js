import { getComponent } from '@appbaseio/reactivecore/lib/utils/helper';
import { PureComponent } from 'react';

/**
 * Avoids the re-rendering due to context in ComponentWrapper to propogate
 * to child components. Usage should be restricted to ComponentWrapper.
*/
export default class PureComponentWrapper extends PureComponent {
	render() {
		return getComponent({}, this.props);
	}
}
