const {promisify} = require('util')
const fs = require('fs')
const test = require('ava')
const execa = require('execa')
const {TEST_SUCCESS_CODE} = require('../../lib/exit-codes.js')
const {normalizeTapOutput} = require('../utils.js')

const readFile = promisify(fs.readFile)

test('it parses config with JSON comments without problems', async t => {
	const [{code, stdout}, expected] = await Promise.all([
		execa('../../cli.js', {
			input: 'body {\n\tcolor: blue;\n}\n',
			cwd: __dirname
		}),
		readFile('./test/config-with-comments/expected.txt', {
			encoding: 'utf8'
		})
	])

	normalizeTapOutput(expected).forEach(line => t.true(stdout.includes(line)))

	t.is(code, TEST_SUCCESS_CODE)
})
