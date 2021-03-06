const uniqueRandomArray = require('unique-random-array')

const error = uniqueRandomArray([
	"Er, Gromit, old pal? It happened again. I'll need assistance.",
	'Better find some more tools for this job, Gromit.',
	"Oh Dear. I'll need more tools to sort this one out",
	'More tools needed for this, old friend.',
	"Oh, it's hopeless. I'll never fix this flippin' machine. Me mind's just a rabbity mush."
])

const ok = uniqueRandomArray([
	'Well done, lad! Very well done...',
	'Well I think we got away with that, eh pooch!',
	"All's well that ends well, that's what I say",
	'One for the album!'
])

const INVALID_OR_MISSING_CONFIG_FILE =
	'Please provide a valid config file by creating a .gromitrc file or setting the path to a config file via the --config flag.\n\nDocs: https://github.com/bartveneman/gromit-cli#config-file'

module.exports = {ok, error, INVALID_OR_MISSING_CONFIG_FILE}
