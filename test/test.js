const test = require('ava')
const execa = require('execa')

test('it shows the version when passing -v', async t => {
	const {stdout} = await execa('./cli.js', ['-v'])
	t.is(stdout, '1.0.0')
})

test('it shows the version when passing --version', async t => {
	const {stdout} = await execa('./cli.js', ['--version'])
	t.is(stdout, '1.0.0')
})

test('it passes when given a valid config and css file', async t => {
	const {stdout} = await execa('./cli.js', [
		'test/fixture.css',
		'--config',
		'test/fixture.jsonc'
	])
	t.false(stdout.includes('not ok'))
	t.true(stdout.includes('✔'))
})

test('it passes when given a valid config file and css via STDIN', async t => {
	const {stdout} = await execa('./cli.js', ['--config', 'test/fixture.jsonc'], {
		input: 'body { color: blue; }'
	})
	t.false(stdout.includes('not ok'))
	t.true(stdout.includes('✔'))
})

test('it fails when css exceeds config settings', async t => {
	try {
		await execa('./cli.js', ['--config', 'test/fixture.jsonc'], {
			input: 'body { color: blue; color: red; }'
		})
	} catch (error) {
		t.is(error.code, 1)
		t.true(error.stdout.includes('not ok'))
		t.false(error.stdout.includes('✔'))
	}
})
