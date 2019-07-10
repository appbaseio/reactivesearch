import React from 'react';
import types from '@appbaseio/reactivecore/lib/utils/types';
import MicImage from '../../../styles/MicImage';
import { getComponent, hasCustomRenderer } from '../../../utils';

const STATUS = {
	initial: 'INITIAL',
	stopped: 'STOPPED',
	allowed: 'ALLOWED',
	deined: 'DENIED',
};

class Mic extends React.Component {
	constructor() {
		super();
		this.state = {
			status: STATUS.initial,
		};
		window.SpeechRecognition
			= window.webkitSpeechRecognition || window.SpeechRecognition || null;
		this.results = [];
	}

	handleClick = () => {
		this.results = [];
		if (window.SpeechRecognition) {
			const { status } = this.state;
			if (status === STATUS.initial) {
				this.setState({
					status: STATUS.stopped,
				});
			}
			const {
				onResult, onNoMatch, onError, lang, getInstance,
			} = this.props;
			const { SpeechRecognition } = window;
			if (this.instance) {
				this.setState(
					{
						status: STATUS.initial,
					},
					() => {
						this.instance.stop();
						this.instance = null;
					},
				);
				return;
			}
			this.instance = new SpeechRecognition();
			this.instance.continuous = true;
			this.instance.interimResults = true;
			this.instance.lang = lang;
			if (getInstance) {
				getInstance(this.instance);
			}
			this.instance.start();
			this.instance.onstart = () => {
				this.setState({
					status: STATUS.allowed,
				});
			};
			this.instance.onresult = ({ results, timeStamp }) => {
				this.setState({
					status: STATUS.initial,
				});
				if (onResult) {
					onResult({ results, timeStamp });
				}
				this.results.push({ results, timeStamp });
			};
			this.instance.onnomatch = e => (onNoMatch ? onNoMatch(e) : console.warn(e));
			this.instance.onerror = (e) => {
				if (e.error === 'no-speech' || e.error === 'audio-capture') {
					this.setState({
						status: STATUS.initial,
					});
				} else if (e.error === 'not-allowed') {
					this.setState({
						status: STATUS.deined,
					});
				}
				console.error(e);
				if (onError) {
					onError(e);
				}
			};

			/* Below Two methods run when Continuous is False */
			this.instance.onspeechend = () => {
				this.setState({
					status: STATUS.initial,
				});
			};

			this.instance.onaudioend = () => {
				this.setState({
					status: STATUS.initial,
				});
			};
		}
	};

	get Image() {
		const { status } = this.state;
		switch (status) {
			case STATUS.allowed:
				return 'https://gist.githubusercontent.com/bietkul/20f702276adff150f3cc4502254665d2/raw/02a339636df69878b48608468f4f25333d3ef8c9/animation.gif';
			case STATUS.stopped:
			case STATUS.deined:
				return 'https://gist.githubusercontent.com/bietkul/20f702276adff150f3cc4502254665d2/raw/02a339636df69878b48608468f4f25333d3ef8c9/mute.gif';
			default:
				return 'https://gist.githubusercontent.com/bietkul/20f702276adff150f3cc4502254665d2/raw/02a339636df69878b48608468f4f25333d3ef8c9/mic.gif';
		}
	}

	getComponent() {
		const { status } = this.state;
		const data = {
			handleClick: this.handleClick,
			status,
		};
		return getComponent(data, this.props);
	}

	get hasCustomRenderer() {
		return hasCustomRenderer(this.props);
	}

	render() {
		const { iconPosition, className } = this.props;
		if (this.hasCustomRenderer) {
			return this.getComponent();
		}
		return (
			<MicImage
				className={className}
				iconPosition={iconPosition}
				onClick={this.handleClick}
				alt="voice search"
				src={this.Image}
			/>
		);
	}
}

Mic.defaultProps = {
	lang: 'en-US',
	iconPosition: 'left',
};

Mic.propTypes = {
	children: types.title,
	lang: types.string,
	iconPosition: types.string,
	onResult: types.func,
	onNoMatch: types.func,
	onError: types.func,
	getInstance: types.func,
	render: types.func,
	className: types.string,
};

export default Mic;
