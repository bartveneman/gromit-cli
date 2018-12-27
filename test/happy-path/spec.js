const {promisify} = require('util')
const fs = require('fs')
const test = require('ava')
const execa = require('execa')

const readFile = promisify(fs.readFile)

test('it reports a success if all assertions pass with CSS via stdIn', async t => {
	const [{stdout: actual}, expected] = await Promise.all([
		execa('../../cli.js', {
			input: 'body { color: blue; }',
			cwd: __dirname
		}),
		readFile('./test/happy-path/expected-success.txt', {
			encoding: 'utf8'
		})
	])

	expected
		.split('\n')
		.map(line => line.replace(/#.*|^✔.*|^✖.*/, '').trim())
		.filter(line => line !== '')
		.forEach(line => t.true(actual.includes(line)))
})

test.todo(
	'it reports a success if all assertions pass with a CSS file path as an argument'
)
test('it reports a failure if some assertions are exceeded', async t => {
	const [{code: exitCode, stdout: actual}, expected] = await Promise.all([
		t.throwsAsync(
			execa('../../cli.js', {
				input: 'body { color: blue; margin: 0; }',
				cwd: __dirname
			})
		),
		readFile('./test/happy-path/expected-failure.txt', {
			encoding: 'utf8'
		})
	])

	// expected
	// 	.split('\n')
	// 	.map(line => line.replace(/#.*|^✔.*|^✖.*/, '').trim())
	// 	.filter(line => line !== '')
	// 	.forEach(line => {
	// 		t.true(actual.includes(line))
	// 	})

	t.is(exitCode, 1)
})
test.todo('it reports an error if no css is passed') // error code + stdOut
