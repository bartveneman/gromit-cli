const {promisify} = require('util')
const fs = require('fs')
const test = require('ava')
const execa = require('execa')

const readFile = promisify(fs.readFile)

test('it parses config with JSON comments without problems', async t => {
	const [{code: exitCode, stdout: actual}, expected] = await Promise.all([
		execa('../../cli.js', {
			input: 'body {\n\tcolor: blue;\n}\n',
			cwd: __dirname
		}),
		readFile('./test/config-with-comments/expected.txt', {
			encoding: 'utf8'
		})
	])

	expected
		.split('\n')
		.map(line => line.replace(/#.*|^✔.*|^✖.*/, '').trim())
		.filter(line => line !== '')
		.forEach(line => t.true(actual.includes(line)))

	t.is(exitCode, 0)
})
