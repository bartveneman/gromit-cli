const test = require('ava')

const normalizeTapOutput = tapOutput => {
	return tapOutput
		.split('\n')
		.map(line => line.replace(/#.*|^✔.*|^✖.*/, ''))
		.map(line => line.trim())
		.filter(line => line !== '')
}

test('it removes or trims lines correctly', t => {
	t.deepEqual(normalizeTapOutput('# line with comment'), [])
	t.deepEqual(normalizeTapOutput('1..4 # 200ms'), ['1..4'])
	t.deepEqual(normalizeTapOutput('✔ all good'), [])
	t.deepEqual(normalizeTapOutput('✖ nope'), [])
})

exports.normalizeTapOutput = normalizeTapOutput
