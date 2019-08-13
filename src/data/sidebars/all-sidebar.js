import docsSidebar from './docs.yaml';
import apiSidebar from './api-reference.yaml';

const sidebar = [...docsSidebar, ...apiSidebar];

const list = sidebar
	.reduce((agg, item) => [...item.groups, ...agg], [])
	.filter(item => !!item.items)
	.reduce((agg, item) => {
		const parsedItems = item.items.map(link => ({
			...link,
			topic: item.group,
		}));

		return [...parsedItems, ...agg];
	}, []);

export default list;
