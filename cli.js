#!/usr/bin/env node
'use strict'

/* eslint-disable unicorn/no-process-exit */
const {readFile} = require('fs')
const {promisify} = require('util')
const {resolve} = require('path')
const analyzeCss = require('@projectwallace/css-analyzer')
const logSymbols = require('log-symbols')
const getStdin = require('get-stdin')
const meow = require('meow')
const stripJsonComments = require('strip-json-comments')
const parseJson = require('parse-json')
const pathExists = require('path-exists')

const flattenStats = require('./lib/flatten-stats.js')
const {ok: successMessage, error: failureMessage} = require('./lib/messages.js')
const runTests = require('./lib/test-runner.js')

const TEST_SUCCESS_CODE = 0
const TEST_FAILURE_CODE = 1
const APPLICATION_ERROR_CODE = 2

const readFilePromise = promisify(readFile)
const cli = meow(
	`
	Usage
		$ gromit <input>
		$ <input> | gromit

	Options
		--config, -c Set path to a Gromit config file (JSON)
		--help, -h Show this help
		--version, -v Show the version number

	Examples
		$ gromit style.css
		$ gromit style.css --config=/path/to/.gromitrc
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

// Read the filepath from the CLI
const filePath = cli.input[0]

// Show the help if there is no file argument
if (!filePath && process.stdin.isTTY) {
	cli.showHelp()
}

// Use either the CLI file argument or StdIn
const cssFile = filePath ? readFilePromise(resolve(filePath)) : getStdin()

pathExists(cli.flags.config).then(exists => {
	if (!exists) {
		console.log(
			'\n',
			logSymbols.error,
			'Please provide a valid config file by creating a .gromitrc file or setting the path to a config file via the --config= flag. \n\nDocs: https://github.com/bartveneman/gromit#config-file'
		)
		process.exit(APPLICATION_ERROR_CODE)
	}
})

const configFile = readFilePromise(resolve(cli.flags.config), 'utf8')

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
		console.log('\n', logSymbols.error, error.message)
		process.exit(APPLICATION_ERROR_CODE)
	})

// Tell the user whether the tests have passed or not
// and exit with a proper exit code
process.on('exit', code => {
	if (code === TEST_FAILURE_CODE) {
		return console.log(logSymbols.error, `"${failureMessage()}"`)
	}

	if (code === TEST_SUCCESS_CODE) {
		return console.log(logSymbols.success, `"${successMessage()}"`)
	}
})
