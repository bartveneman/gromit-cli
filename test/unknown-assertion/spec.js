const test = require('ava')
const execa = require('execa')
const {TEST_FAILURE_CODE} = require('../../lib/exit-codes.js')

test('it shows an alternative assertion if a given one in the config cannot be found', async t => {
	const {stdout} = await t.throwsAsync(
		execa('../../cli.js', {
			input: 'body {\n\tcolor: blue;\n}\n',
			cwd: __dirname
		})
	)

	t.true(
		stdout.includes(
			`not ok 1 - Could not assert 'stylesheet.size'. Did you mean 'stylesheets.size'?`
		)
	)
	t.true(stdout.includes('not ok 1 - stylesheet.size'))
	t.true(stdout.includes('# failed 1 test'))
})

test('it fails the test if an unknown assertion is given in the config', async t => {
	const {code} = await t.throwsAsync(
		execa('../../cli.js', {
			input: 'body {\n\tcolor: blue;\n}\n',
			cwd: __dirname
		})
	)

	t.is(code, TEST_FAILURE_CODE)
})
