const {promisify} = require('util')
const fs = require('fs')
const test = require('ava')
const execa = require('execa')
const {
	TEST_SUCCESS_CODE,
	APPLICATION_ERROR_CODE
} = require('../../lib/exit-codes.js')
const {INVALID_OR_MISSING_CONFIG_FILE} = require('../../lib/messages.js')
const {normalizeTapOutput} = require('../utils.js')

const readFile = promisify(fs.readFile)

test('it handles a custom config file correctly when a valid config path is given', async t => {
	const [{code, stdout}, expected] = await Promise.all([
		execa('./cli.js', ['--config=test/custom-config-file/config.json'], {
			input: 'body {\n\tcolor: blue;\n}\n'
		}),
		readFile('./test/config-with-comments/expected.txt', {
			encoding: 'utf8'
		})
	])

	normalizeTapOutput(expected).forEach(line => t.true(stdout.includes(line)))

	t.is(code, TEST_SUCCESS_CODE)
})

test('it shows a helpful error message when the custom config file cannot be found', async t => {
	const {code, stdout} = await t.throwsAsync(
		execa(
			'./cli.js',
			['--config=test/custom-config-file/NON_EXISTENT_FILE.json'],
			{
				input: 'body {\n\tcolor: blue;\n}\n'
			}
		)
	)

	t.true(stdout.includes(INVALID_OR_MISSING_CONFIG_FILE))
	t.is(code, APPLICATION_ERROR_CODE)
})
