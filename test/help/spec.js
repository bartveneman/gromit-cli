const test = require('ava')
const execa = require('execa')

test('it shows a help message when called without arguments', async t => {
	const {stdout} = await execa('./cli.js')
	// validate help message
})

test('it shows a help message when called with --help', async t => {
	const {stdout} = await execa('./cli.js', ['--help'])
	// validate help message
})

test('it shows a help message when called with -h', async t => {
	const {stdout} = await execa('./cli.js', ['-h'])
	// validate help message
})
