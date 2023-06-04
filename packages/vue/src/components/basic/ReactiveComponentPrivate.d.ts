import {ReactiveComponentProps} from './ReactiveComponent'

declare function ReactiveComponentPrivate(props: any): JSX.Element;

interface ReactiveComponentPrivateProps extends ReactiveComponentProps{
    componentType: "SEARCHBOX" | "REACTIVELIST" | "MULTILIST" | "MULTIDROPDOWNLIST" | "SINGLEDROPDOWNLIST" | "SINGLELIST" | "RANGESLIDER" | "RANGEINPUT" | "DYNAMICRANGESLIDER"
}

export default ReactiveComponentPrivate;
