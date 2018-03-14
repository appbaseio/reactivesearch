import { composeThemeObject } from '../index';

test('returns base object if nothing is passed', () => {
	const result = composeThemeObject();
	expect(result).toEqual({
		colors: {},
		typography: {},
		component: {},
	});
});

test('overrides existing keys', () => {
	const result = composeThemeObject({
		colors: {
			primaryTextColor: '#fff',
		},
		typography: {
			fontSize: '16px',
		},
		component: {},
	}, {
		colors: {},
		typography: {
			fontSize: '24px',
		},
		component: {
			padding: 20,
		},
	});
	expect(result).toEqual({
		colors: {
			primaryTextColor: '#fff',
		},
		typography: {
			fontSize: '24px',
		},
		component: {
			padding: 20,
		},
	});
});
