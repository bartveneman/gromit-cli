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

const flattenStats = require('./lib/flatten-stats.js')
const {ok: successMessage, error: failureMessage} = require('./lib/messages.js')
const runTests = require('./lib/test-runner.js')

const readFilePromise = promisify(readFile)
const cli = meow(
	`
	Usage
		$ gromit <input>
		$ <input> | gromit

	Options
		--config, -c Set path to a Gromit config file (JSON)

	Examples
		$ gromit style.css
		$ gromit style.css --config=/path/to/.gromitrc
		$ cat style.css | gromit
`,
	{
		flags: {
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
const css = filePath ? readFilePromise(resolve(filePath)) : getStdin()

// Read input and config
Promise.all([css, readFilePromise(resolve(cli.flags.config), 'utf8')])
	.then(([css, config]) => ({css, config: JSON.parse(config)}))

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
		process.exit(testsPassed ? 0 : 1)
	})

// Tell the user whether the tests have passed or not
// and exit with a proper exit code
process.on('exit', code => {
	if (code !== 0) {
		return console.log('\n', logSymbols.error, `"${failureMessage()}"`)
	}

	return console.log('\n', logSymbols.success, `"${successMessage()}"`)
})
