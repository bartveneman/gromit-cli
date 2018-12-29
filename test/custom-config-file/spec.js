const {promisify} = require('util')
const fs = require('fs')
const test = require('ava')
const execa = require('execa')

const readFile = promisify(fs.readFile)

test('it handles a custom config file correctly when a valid config path is given', async t => {
	const [{code: exitCode, stdout: actual}, expected] = await Promise.all([
		execa('./cli.js', ['--config=test/custom-config-file/config.json'], {
			input: 'body {\n\tcolor: blue;\n}\n'
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

test('it shows a helpful error message when the custom config file cannot be found', async t => {
	const {code: exitCode, stdout: actual} = await t.throwsAsync(
		execa(
			'./cli.js',
			['--config=test/custom-config-file/NON_EXISTENT_FILE.json'],
			{
				input: 'body {\n\tcolor: blue;\n}\n'
			}
		)
	)

	t.true(
		actual.includes(
			'Please provide a valid config file by creating a .gromitrc file or setting the path to a config file via the --config flag. \n\nDocs: https://github.com/bartveneman/gromit-cli#config-file'
		)
	)
	t.is(exitCode, 2)
})
