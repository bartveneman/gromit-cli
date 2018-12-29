const {promisify} = require('util')
const fs = require('fs')
const test = require('ava')
const execa = require('execa')

const readFile = promisify(fs.readFile)

test('it shows a help message when called with --help', async t => {
	const [{stdout: actual, code: exitCode}, expected] = await Promise.all([
		execa('./cli.js', ['--help']),
		readFile('./test/help/expected.txt', {encoding: 'utf8'})
	])

	t.deepEqual(
		actual
			.split('\n')
			.map(line => line.trim())
			.filter(line => Boolean(line)),
		expected
			.split('\n')
			.map(line => line.trim())
			.filter(line => Boolean(line))
	)
	t.is(exitCode, 0)
})
