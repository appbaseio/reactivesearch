/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import types from '@appbaseio/reactivecore/lib/utils/types';
import {
	getClassName,
	getComponent,
	hasCustomRenderer,
} from '@appbaseio/reactivecore/lib/utils/helper';
import MicSvg from '../../shared/MicSvg';
import MuteSvg from '../../shared/MuteSvg';
import ListenSvg from '../../shared/ListenSvg';
import IconWrapper from '../../../styles/IconWrapper';

const STATUS = {
	inactive: 'INACTIVE',
	stopped: 'STOPPED',
	active: 'ACTIVE',
	denied: 'DENIED',
};

class Mic extends React.Component {
	constructor() {
		super();
		this.state = {
			status: STATUS.inactive,
		};
		this.results = [];

		if (typeof window !== 'undefined') {
			window.SpeechRecognition
				= window.webkitSpeechRecognition || window.SpeechRecognition || null;

			if (!window.SpeechRecognition) {
				console.error(
					'SpeechRecognition is not supported in this browser. Please check the browser compatibility at https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition#Browser_compatibility.',
				);
			}
		}
	}

	stopMic = () => {
		if (this.instance) {
			this.setState(
				{
					status: STATUS.inactive,
				},
				() => {
					this.instance.stop();
					this.instance = null;
				},
			);
		}
	};

	handleClick = () => {
		this.results = [];
		if (window && window.SpeechRecognition) {
			const { status } = this.state;
			if (status === STATUS.active) {
				this.setState({
					status: STATUS.inactive,
				});
			}
			const {
				onResult, onNoMatch, onError, lang, getInstance,
			} = this.props;
			const { SpeechRecognition } = window;
			if (this.instance && status !== STATUS.denied) {
				this.setState(
					{
						status: STATUS.inactive,
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
			this.instance.interimResults = false;
			this.instance.lang = lang;
			if (getInstance) {
				getInstance(this.instance);
			}
			this.instance.start();
			this.instance.onstart = () => {
				this.setState({
					status: STATUS.active,
				});
			};
			this.instance.onresult = ({ results, timeStamp }) => {
				this.stopMic();
				if (onResult) {
					onResult({ results, timeStamp });
				}
				this.results.push({ results, timeStamp });
			};
			this.instance.onnomatch = e => (onNoMatch ? onNoMatch(e) : console.warn(e));
			this.instance.onerror = (e) => {
				if (e.error === 'no-speech' || e.error === 'audio-capture') {
					this.setState({
						status: STATUS.inactive,
					});
				} else if (e.error === 'not-allowed') {
					this.setState({
						status: STATUS.denied,
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
					status: STATUS.inactive,
				});
			};

			this.instance.onaudioend = () => {
				this.setState({
					status: STATUS.inactive,
				});
			};
		}
	};

	get Icon() {
		const { status } = this.state;
		const { className } = this.props;
		switch (status) {
			case STATUS.active:
				return (
					<ListenSvg
						className={getClassName(className, '--listen-svg')}
						onClick={this.handleClick}
					/>
				);
			case STATUS.stopped:
			case STATUS.denied:
				return <MuteSvg className={className} onClick={this.handleClick} />;
			default:
				return <MicSvg className={className} onClick={this.handleClick} />;
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
		if (this.hasCustomRenderer) {
			return this.getComponent();
		}
		return <IconWrapper>{this.Icon}</IconWrapper>;
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
	applyClearStyle: types.bool,
	showIcon: types.bool,
};

export default Mic;
