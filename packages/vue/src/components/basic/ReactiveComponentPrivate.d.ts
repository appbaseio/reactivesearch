import {ReactiveComponentProps} from './ReactiveComponent'

declare function ReactiveComponentPrivate(props: any): JSX.Element;

interface ReactiveComponentPrivateProps extends ReactiveComponentProps{
    componentType: string
}

export default ReactiveComponentPrivate;
