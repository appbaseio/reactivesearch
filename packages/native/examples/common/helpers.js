export const DEFAULT_COLORS = {
	primary: '#1A237E',
	secondary: '#D1C4E9',
	seperator: '#E6E6E6',
};

export const commonStyles = {
	padding1: {
		padding: 10,
	},
	padding2: {
		padding: 20,
	},
	padding3: {
		padding: 30,
	},
	padding4: {
		padding: 40,
	},
	padding5: {
		padding: 50,
	},
	container: {
		flex: 1,
	},
	row: {
		flexDirection: 'row',
	},
	column: {
		flexDirection: 'column',
	},
	alignCenter: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	none: {
		display: 'none',
	},
	flex: {
		display: 'flex',
	},
};

export const kFormatter = num => (num > 100 ? `${(num / 1000).toFixed(1)}k` : num);

