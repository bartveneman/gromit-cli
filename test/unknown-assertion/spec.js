const {promisify} = require('util')
const fs = require('fs')
const test = require('ava')
const execa = require('execa')

const readFile = promisify(fs.readFile)

test('it shows an alternative assertion if a given one in the config cannot be found', async t => {
	const {stdout: actual} = await t.throwsAsync(
		execa('../../cli.js', {
			input: 'body {\n\tcolor: blue;\n}\n',
			cwd: __dirname
		})
	)

	t.true(
		actual.includes(
			`not ok 1 - Could not assert 'stylesheet.size'. Did you mean 'stylesheets.size'?`
		)
	)
	t.true(actual.includes('not ok 1 - stylesheet.size'))
	t.true(actual.includes('# failed 1 test'))
})

test('it fails the test if an unknown assertion is given in the config', async t => {
	const {code: exitCode} = await t.throwsAsync(
		execa('../../cli.js', {
			input: 'body {\n\tcolor: blue;\n}\n',
			cwd: __dirname
		})
	)

	t.is(exitCode, 1)
})
