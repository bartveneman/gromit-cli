const test = require('ava')
const execa = require('execa')

test('it reports an error if a .gromitrc is not found in the current working directory', async t => {
	const {code: exitCode, stdout: actual} = await t.throwsAsync(
		execa('../../cli.js', {
			input: 'body {\n\tcolor: blue;\n}\n',
			cwd: __dirname
		})
	)

	t.true(
		actual.includes(
			'Please provide a valid config file by creating a .gromitrc file or setting the path to a config file via the --config flag. \n\nDocs: https://github.com/bartveneman/gromit-cli#config-file'
		)
	)
	t.is(exitCode, 2)
})
