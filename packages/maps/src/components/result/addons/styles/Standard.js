module.exports = [
	{ featureType: 'water', stylers: [{ saturation: 43 }, { lightness: -11 }, { hue: '#0088ff' }] },
	{
		featureType: 'road',
		elementType: 'geometry.fill',
		stylers: [{ hue: '#ff0000' }, { saturation: -100 }, { lightness: 99 }],
	},
	{
		featureType: 'road',
		elementType: 'geometry.stroke',
		stylers: [{ color: '#808080' }, { lightness: 54 }],
	},
	{
		featureType: 'landscape.man_made',
		elementType: 'geometry.fill',
		stylers: [{ color: '#ece2d9' }],
	},
	{ featureType: 'poi.park', elementType: 'geometry.fill', stylers: [{ color: '#ccdca1' }] },
	{ featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#767676' }] },
	{ featureType: 'road', elementType: 'labels.text.stroke', stylers: [{ color: '#ffffff' }] },
	{ featureType: 'poi', stylers: [{ visibility: 'off' }] },
	{
		featureType: 'landscape.natural',
		elementType: 'geometry.fill',
		stylers: [{ visibility: 'on' }, { color: '#b8cb93' }],
	},
	{ featureType: 'poi.park', stylers: [{ visibility: 'on' }] },
	{ featureType: 'poi.sports_complex', stylers: [{ visibility: 'on' }] },
	{ featureType: 'poi.medical', stylers: [{ visibility: 'on' }] },
	{ featureType: 'poi.business', stylers: [{ visibility: 'simplified' }] },
];
