/* eslint-disable */

/*
	USAGE: (also accepts hexcodes without '#')

	shade("#6699CC", 0.2);		// "#7ab8f5" - 20% lighter
	shade("#69C", -0.5);		// "#334d66" - 50% darker
*/

export function shade(color, percent) {
	// validate hex string
	let hex = String(color).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	let lum = percent || 0;

	// convert to decimal and change luminosity
	let rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}

	return rgb;
}
