const test = require('ava')
const execa = require('execa')
const semver = require('semver')

test('it shows a valid version when passing -v', async t => {
	const {stdout} = await execa('./cli.js', ['-v'])
	t.is(stdout, semver.valid(stdout))
})

test('it shows a valid version when passing --version', async t => {
	const {stdout} = await execa('./cli.js', ['--version'])
	t.is(stdout, semver.valid(stdout))
})
