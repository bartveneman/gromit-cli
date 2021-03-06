#!/usr/bin/env node
'use strict'

const {readFile} = require('fs')
const {promisify} = require('util')
const {resolve: resolvePath} = require('path')
const analyzeCss = require('@projectwallace/css-analyzer')
const {error: errorSymbol, success: successSymbol} = require('log-symbols')
const getStdin = require('get-stdin')
const meow = require('meow')
const stripJsonComments = require('strip-json-comments')
const parseJson = require('parse-json')
const pathExists = require('path-exists')
const updateNotifier = require('update-notifier')

const flattenStats = require('./lib/flatten-stats.js')
const {
	ok: successMessage,
	error: failureMessage,
	INVALID_OR_MISSING_CONFIG_FILE
} = require('./lib/messages.js')
const runTests = require('./lib/test-runner.js')

const {
	TEST_SUCCESS_CODE,
	TEST_FAILURE_CODE,
	APPLICATION_ERROR_CODE
} = require('./lib/exit-codes.js')

const readFileAsync = promisify(readFile)
const cli = meow(
	`
	Usage
		$ gromit <input>
		$ <input> | gromit

	Options
		--config, -c Set path to a Gromit config file (JSON)
		--help Show this help
		--version, -v Show the version number

	Examples
		$ gromit style.css
		$ gromit style.css --config /path/to/.gromitrc
		$ cat style.css | gromit
`,
	{
		flags: {
			version: {
				alias: 'v'
			},
			config: {
				type: 'string',
				default: '.gromitrc'
			}
		}
	}
)

updateNotifier({pkg: cli.pkg, shouldNotifyInNpmScript: true}).notify()

// Read the file path from the CLI
const [filePath] = cli.input

// Show the help if there is no file argument
if (!filePath && process.stdin.isTTY) {
	cli.showHelp()
}

// Use either the CLI file argument or StdIn
const cssFile = filePath ? readFileAsync(resolvePath(filePath)) : getStdin()

pathExists(cli.flags.config).then(exists => {
	if (!exists) {
		console.log('\n', errorSymbol, INVALID_OR_MISSING_CONFIG_FILE)
		process.exit(APPLICATION_ERROR_CODE)
	}
})

const configFile = readFileAsync(resolvePath(cli.flags.config), 'utf8')

// Read input and config
Promise.all([cssFile, configFile])
	.then(([css, configJson]) => ({
		css,
		config: parseJson(stripJsonComments(configJson), cli.flags.config)
	}))

	// Generate CSS stats from CSS input
	.then(async input => ({...input, stats: await analyzeCss(input.css)}))

	// Flatten the stats so it can be compared to the config
	.then(input => ({...input, stats: flattenStats(input.stats)}))

	// Run the tests with the config on the stats
	.then(input => runTests(input.config, input.stats))

	// Check if all tests have passed
	.then(results => results.every(result => result === true))

	// Send the result to the user
	.then(testsPassed => {
		process.exit(testsPassed ? TEST_SUCCESS_CODE : TEST_FAILURE_CODE)
	})
	.catch(error => {
		console.log('\n', errorSymbol, error.message)
		process.exit(APPLICATION_ERROR_CODE)
	})

// Tell the user whether the tests have passed or not
// and exit with a proper exit code
process.on('exit', code => {
	if (code === TEST_FAILURE_CODE) {
		return console.log(errorSymbol, `"${failureMessage()}"`)
	}

	if (code === TEST_SUCCESS_CODE) {
		return console.log(successSymbol, `"${successMessage()}"`)
	}
})
