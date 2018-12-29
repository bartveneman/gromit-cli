const {promisify} = require('util')
const fs = require('fs')
const test = require('ava')
const execa = require('execa')
const {TEST_SUCCESS_CODE} = require('../../lib/exit-codes.js')
const {normalizeTapOutput} = require('../utils.js')

const readFile = promisify(fs.readFile)

test('it shows a help message when called with --help', async t => {
	const [{stdout, code}, expected] = await Promise.all([
		execa('./cli.js', ['--help']),
		readFile('./test/help/expected.txt', {encoding: 'utf8'})
	])

	t.deepEqual(normalizeTapOutput(stdout), normalizeTapOutput(expected))
	t.is(code, TEST_SUCCESS_CODE)
})
