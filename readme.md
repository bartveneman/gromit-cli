# Gromit

A test framework to assert that CSS doesn't exceeds certain tresholds.

- Provide a [config file](#config-file) with tresholds to check
- Pass in the CSS
- Gromit will let you know whether your CSS passes the test

## Usage

Gromit relies on you passing in CSS and a config.

```sh
# Default usage
$ gromit style.css

# Custom config
$ gromit style.css --config=my-config.json

# Read from StdIn
$ cat style.css | gromit
```

The result will look like something like this:

```sh
TAP version 13
# Subtest: selectors.id.total
    ok 1 - selectors.id.total should not be larger than 0 (actual: 0)
    1..1
ok 1 - selectors.id.total # time=6.024ms

1..1
# time=15.076ms

 ✔ "Well done, lad! Very well done..."
```

Note that this example uses only 1 test (total ID selectors).

## Config file

Gromit will try to fetch a `.gromitrc` file in your current directory. You can
also specify a different JSON config file with the `--config` option
([see usage](#usage)). The config JSON should look similar to this:

```json
{
	"selectors.id.total": 0,
	"values.colors.totalUnique": 2,
	"values.colors.unique": ["#fff", "#000"]
}
```

All the possible options for the config file can be found at
[@projectwallace/css-analyzer](https://github.com/projectwallace/css-analyzer#usage)

## Custom reporter

By default, Gromit will report in the
[TAP format](https://www.node-tap.org/tap-format/), but you can pipe the output
into something you may find prettier, like
[tap-nyan](https://www.npmjs.com/package/tap-nyan) or any other
[TAP-reporter](https://github.com/substack/tape#pretty-reporters).

```sh
$ gromit style.css | tap-nyan

 1   -_,------,
 0   -_|   /\_/\
 0   -^|__( ^ .^)
     -  ""  ""
  Pass!
```

## Usage in CI

If any test fails, Gromit will exit with a non-zero exit code. When you run
Gromit in your CI builds, this may cause the build to fail. This is exactly what
Gromit was designed to do.

Example usage with package.json:

```json
{
	"name": "my-package",
	"version": "0.1.0",
	"scripts": {
		"test": "gromit compiled-styles.css"
	}
}
```
