import React from 'react';

const SliderHandle = ({
	className, style, tooltipTrigger, renderTooltipData, ...passProps
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
		const tooltipContent = passProps['aria-valuenow'];
		return (
			<button style={style} className={className} {...passProps} >
				<span className={tooltipClassname}>
					{renderTooltipData ? renderTooltipData(tooltipContent) : tooltipContent}
				</span>
			</button>
		);
	}
	return <button style={style} className={className} {...passProps} />;
};

export default SliderHandle;
