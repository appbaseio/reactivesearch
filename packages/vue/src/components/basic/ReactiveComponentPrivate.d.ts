import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';
import {ReactiveComponentProps} from './ReactiveComponent'

interface ReactiveComponentPrivateProps extends ReactiveComponentProps{
  componentType: typeof componentTypes[keyof typeof componentTypes];
}

declare function ReactiveComponentPrivate(props: ReactiveComponentPrivateProps): JSX.Element;

export default ReactiveComponentPrivate;
