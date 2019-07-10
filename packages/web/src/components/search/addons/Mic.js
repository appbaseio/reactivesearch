import React from 'react';
import types from '@appbaseio/reactivecore/lib/utils/types';
import MicImage from '../../../styles/MicImage';

const STATUS = {
	initial: 'INITIAL',
	started: 'STARTED',
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
					status: STATUS.started,
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
				return 'https://raw.githubusercontent.com/googlearchive/webplatform-samples/master/webspeechdemo/mic-animate.gif';
			case STATUS.started:
			case STATUS.deined:
				return 'https://raw.githubusercontent.com/googlearchive/webplatform-samples/master/webspeechdemo/mic-slash.gif';
			default:
				return 'https://raw.githubusercontent.com/googlearchive/webplatform-samples/master/webspeechdemo/mic.gif';
		}
	}

	render() {
		const { iconPosition } = this.props;
		return (
			<MicImage
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
};

export default Mic;
