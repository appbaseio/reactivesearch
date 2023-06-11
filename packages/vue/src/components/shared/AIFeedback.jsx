import { defineComponent, ref, watch } from 'vue';

import { AIFeedbackContainer } from '../../styles/AIAnswer';

import ThumbsUpSvg from './ThumbsUpSvg';
import ThumbsDownSvg from './ThumbsDownSvg';
import Input from '../../styles/Input';

import Button from '../../styles/Button';

export default defineComponent({
	name: 'FeedbackComponent',
	props: {
		onFeedbackSubmit: {
			type: Function,
			default: () => {},
		},
		hideUI: {
			type: Boolean,
			default: false,
		},
		overrideState: {
			type: Object,
			default: () => ({}),
		},
	},
	setup(props, { emit }) {
		const showInput = ref(false);
		const feedbackType = ref(null);
		const feedbackText = ref('');
		const feedbackRecorded = ref(false);

		const handleButtonClick = (type) => {
			if (feedbackType.value === type) {
				feedbackType.value = null;
				showInput.value = false;
			} else {
				feedbackType.value = type;
				showInput.value = true;
			}
		};

		const handleInputChange = (e) => {
			feedbackText.value = e.target.value;
		};

		const handleSubmit = () => {
			emit('feedback-submit', feedbackType.value === 'positive', feedbackText.value);

			feedbackText.value = '';
			showInput.value = false;
			feedbackRecorded.value = true;
		};

		const handleCancel = () => {
			feedbackType.value = null;
			feedbackText.value = '';
			showInput.value = false;
		};

		watch(
			() => props.overrideState,
			(newValue) => {
				if (newValue && newValue.isRecorded) {
					feedbackRecorded.value = true;
					feedbackType.value = newValue.feedbackType || 'positive';
				}
			},
		);
		if (props.overrideState && props.overrideState.isRecorded) {
			feedbackRecorded.value = true;
			feedbackType.value = props.overrideState.feedbackType || 'positive';
		}
		return {
			showInput,
			feedbackType,
			feedbackText,
			feedbackRecorded,
			handleButtonClick,
			handleInputChange,
			handleSubmit,
			handleCancel,
		};
	},
	render() {
		if (this.$props.hideUI) {
			return null;
		}
		if (this.feedbackRecorded) {
			return (
				<AIFeedbackContainer>
					<div class="--feedback-svgs-wrapper">
						{this.feedbackType === 'positive' ? (
							<ThumbsUpSvg class="selected" />
						) : (
							<ThumbsDownSvg class="selected" />
						)}
					</div>
				</AIFeedbackContainer>
			);
		}
		return (
			<AIFeedbackContainer>
				{!this.showInput && (
					<div class="--feedback-svgs-wrapper">
						<ThumbsUpSvg
							class={this.feedbackType === 'positive' ? 'selected' : ''}
							onClick={() => this.handleButtonClick('positive')}
						/>

						<ThumbsDownSvg
							class={this.feedbackType === 'negative' ? 'selected' : ''}
							onClick={() => this.handleButtonClick('negative')}
						/>
					</div>
				)}

				{this.showInput && (
					<div class="--feedback-input-wrapper">
						<Input
							show={this.showInput}
							placeholder={
								this.feedbackType === 'positive'
									? 'What do you like about the response?'
									: 'What was the issue with the response? How can it be improved?'
							}
							value={this.feedbackText}
							onInput={this.handleInputChange}
						/>
						<Button primary onClick={this.handleSubmit}>
							Submit
						</Button>
						<Button onClick={this.handleCancel}>Cancel</Button>
					</div>
				)}
			</AIFeedbackContainer>
		);
	},
});
