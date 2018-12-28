const {promisify} = require('util')
const fs = require('fs')
const test = require('ava')
const execa = require('execa')

const readFile = promisify(fs.readFile)

test('it reports a success if all assertions pass with CSS via stdIn', async t => {
	const [{stdout: actual}, expected] = await Promise.all([
		execa('../../cli.js', {
			input: 'body {\n\tcolor: blue;\n}\n',
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

test('it reports a success if all assertions pass with a CSS file path as an argument', async t => {
	const [{stdout: actual}, expected] = await Promise.all([
		execa('../../cli.js', ['fixture-success.css'], {
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

test('it reports a failure if some assertions are exceeded', async t => {
	const {code: exitCode, stdout: actual} = await t.throwsAsync(
		execa('../../cli.js', {
			input: 'body {\n\tcolor: blue;\n\tmargin: 0;\n}\n',
			cwd: __dirname
		})
	)
	;[
		'not ok 1 - declarations.total should not be larger than 1 (actual: 2)',
		'not ok 1 - declarations.totalUnique should not be larger than 1 (actual: 2)',
		'not ok 1 - properties.total should not be larger than 1 (actual: 2)',
		'not ok 1 - properties.totalUnique should not be larger than 1 (actual: 2)',
		'not ok 47 - properties.unique',
		'not ok 1 - stylesheets.cohesion.average should not be larger than 1 (actual: 2)',
		'not ok 1 - stylesheets.size should not be larger than 23 (actual: 35)',
		'not ok 1 - values.total should not be larger than 1 (actual: 2)',
		'# failed 8 of 94 tests'
	].forEach(subTestFailure => t.true(actual.includes(subTestFailure)))

	t.is(exitCode, 1)
})

test('it reports an error if no css is passed', async t => {
	const {code: exitCode, stdout: actual} = await t.throwsAsync(
		execa('../../cli.js', ['fixture-failure.css'], {
			cwd: __dirname
		})
	)
	;[
		'not ok 1 - declarations.total should not be larger than 1 (actual: 2)',
		'not ok 1 - declarations.totalUnique should not be larger than 1 (actual: 2)',
		'not ok 1 - properties.total should not be larger than 1 (actual: 2)',
		'not ok 1 - properties.totalUnique should not be larger than 1 (actual: 2)',
		'not ok 47 - properties.unique',
		'not ok 1 - stylesheets.cohesion.average should not be larger than 1 (actual: 2)',
		'not ok 1 - stylesheets.size should not be larger than 23 (actual: 35)',
		'not ok 1 - values.total should not be larger than 1 (actual: 2)',
		'# failed 8 of 94 tests'
	].forEach(subTestFailure => t.true(actual.includes(subTestFailure)))

	t.is(exitCode, 1)
})
