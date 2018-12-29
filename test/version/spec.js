const test = require('ava')
const execa = require('execa')
const semver = require('semver')
const {TEST_SUCCESS_CODE} = require('../../lib/exit-codes.js')

test('it shows a valid version when passing -v', async t => {
	const {stdout, code} = await execa('./cli.js', ['-v'])
	t.is(stdout, semver.valid(stdout))
	t.is(code, TEST_SUCCESS_CODE)
})

test('it shows a valid version when passing --version', async t => {
	const {stdout, code} = await execa('./cli.js', ['--version'])
	t.is(stdout, semver.valid(stdout))
	t.is(code, TEST_SUCCESS_CODE)
})
