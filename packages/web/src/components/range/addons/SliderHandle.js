import React from 'react';

const SliderHandle = ({
	className, style, showTooltip, ...passProps
}) => {
	if (showTooltip) {
		return (
			<button style={style} className={className} {...passProps} >
				<span className="slider-tooltip">{passProps['aria-valuenow']}</span>
			</button>
		);
	}
	return <button style={style} className={className} {...passProps} />;
};

export default SliderHandle;
