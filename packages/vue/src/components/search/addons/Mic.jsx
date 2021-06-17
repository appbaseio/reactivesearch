import VueTypes from 'vue-types';
import MicIcon from '../../../styles/MicIcon';
import MicSvg from '../../shared/MicSvg';
import MuteSvg from '../../shared/MuteSvg';
import ListenSvg from '../../shared/ListenSvg';
import { hasCustomRenderer, getComponent } from '../../../utils/index';
import types from '../../../utils/vueTypes';

const STATUS = {
	inactive: 'INACTIVE',
	stopped: 'STOPPED',
	active: 'ACTIVE',
	denied: 'DENIED',
};

const Mic = {
	name: 'Mic',
	props: {
		children: types.title,
		lang: types.string.def('en-US'),
		iconPosition: types.string.def('left'),
		handleResult: types.func,
		onNoMatch: types.func,
		onError: types.func,
		getInstance: types.func,
		render: types.func,
		className: types.string,
		applyClearStyle: VueTypes.bool,
		showIcon: VueTypes.bool,
	},
	methods: {
		getComponent() {
			const { status } = this.$data;
			const data = {
				handleClick: this.handleClick,
				status,
			};
			return getComponent(data, this);
		},
		stopMic() {
			if (this.instance) {
				this.status = STATUS.inactive;
				this.instance.stop();
				this.instance = null;
			}
		},
		handleClick() {
			this.results = [];
			if (window && window.SpeechRecognition) {
				const { status } = this.$data;
				if (status === STATUS.active) {
					this.status = STATUS.inactive;
				}
				const { handleResult, onNoMatch, onError, lang, getInstance } = this.$props;
				const { SpeechRecognition } = window;
				if (this.instance && this.status !== STATUS.denied) {
					this.status = STATUS.inactive;
					this.instance.stop();
					this.instance = null;
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
					this.status = STATUS.active;
				};
				this.instance.onresult = ({ results, timeStamp }) => {
					this.stopMic();
					if (handleResult) {
						handleResult({ results, timeStamp });
					}
					this.results.push({ results, timeStamp });
				};
				this.instance.onnomatch = e => (onNoMatch ? onNoMatch(e) : console.warn(e));
				this.instance.onerror = e => {
					if (e.error === 'no-speech' || e.error === 'audio-capture') {
						this.status = STATUS.inactive;
					} else if (e.error === 'not-allowed') {
						this.status = STATUS.denied;
					}
					console.error(e);
					if (onError) {
						onError(e);
					}
				};

				/* Below Two methods run when Continuous is False */
				this.instance.onspeechend = () => {
					this.status = STATUS.inactive;
				};

				this.instance.onaudioend = () => {
					this.status = STATUS.inactive;
				};
			}
		},
	},
	computed: {
		hasCustomRenderer() {
			return hasCustomRenderer(this);
		},
		Icon() {
			const { status } = this.$data;
			const { className } = this.$props;
			switch (status) {
				case STATUS.active:
					return <ListenSvg className={className} nativeOnClick={this.handleClick} />;
				case STATUS.stopped:
				case STATUS.denied:
					return <MuteSvg className={className} nativeOnClick={this.handleClick} />;
				default:
					return <MicSvg className={className} nativeOnClick={this.handleClick} />;
			}
		},
	},
	data() {
		return {
			status: STATUS.inactive,
		};
	},
	created() {
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
	},
	render() {
		const { iconPosition, applyClearStyle, showIcon } = this.$props;
		if (this.hasCustomRenderer) {
			return this.getComponent();
		}
		return (
			<MicIcon showIcon={showIcon} showClear={applyClearStyle} iconPosition={iconPosition}>
				{this.Icon}
			</MicIcon>
		);
	},
};

export default Mic;
