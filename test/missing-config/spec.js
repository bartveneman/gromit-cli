const test = require('ava')
const execa = require('execa')
const {APPLICATION_ERROR_CODE} = require('../../lib/exit-codes.js')
const {INVALID_OR_MISSING_CONFIG_FILE} = require('../../lib/messages.js')

test('it reports an error if a .gromitrc is not found in the current working directory', async t => {
	const {code, stdout} = await t.throwsAsync(
		execa('../../cli.js', {
			input: 'body {\n\tcolor: blue;\n}\n',
			cwd: __dirname
		})
	)

	t.true(stdout.includes(INVALID_OR_MISSING_CONFIG_FILE))
	t.is(code, APPLICATION_ERROR_CODE)
})
