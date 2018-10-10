import React from 'react';

const SliderHandle = ({
	className, style, tooltipTrigger, ...passProps
}) => {
	if (tooltipTrigger) {
		let tooltipClassname = '';
		switch (tooltipTrigger) {
			case 'hover':
				tooltipClassname = 'slider-tooltip';
				break;
			case 'focus':
				tooltipClassname = 'slider-tooltip-focus';
				break;
			case 'always':
				tooltipClassname = 'slider-tooltip-visible';
				break;
			case 'none':
			default:
				return <button style={style} className={className} {...passProps} />;
		}
		return (
			<button style={style} className={className} {...passProps} >
				<span className={tooltipClassname}>{passProps['aria-valuenow']}</span>
			</button>
		);
	}
	return <button style={style} className={className} {...passProps} />;
};

export default SliderHandle;
