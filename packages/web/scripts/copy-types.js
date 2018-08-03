const path = require('path');
const fse = require('fs-extra'); // eslint-disable-line
const glob = require('glob'); // eslint-disable-line

function typescriptCopy(from, to) {
	const files = glob.sync('**/*.d.ts', { cwd: from });
	const cmds = files.map(file =>
		fse.copy(path.resolve(from, file), path.resolve(to, file)));
	return Promise.all(cmds);
}

async function run() {
	const from = path.resolve(__dirname, '../src');
	await typescriptCopy(from, path.resolve(__dirname, '../lib'));
}

run();
