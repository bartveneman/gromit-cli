# Gromit

[![NPM Version][npm-img]][npm]
[![Build Status](https://travis-ci.com/bartveneman/gromit-cli.svg?branch=master)](https://travis-ci.com/bartveneman/gromit-cli)
[![Known Vulnerabilities](https://snyk.io/test/github/bartveneman/gromit-cli/badge.svg)](https://snyk.io/test/github/bartveneman/gromit-cli)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
![Dependencies Status](https://img.shields.io/david/bartveneman/gromit-cli.svg)
![Dependencies Status](https://img.shields.io/david/dev/bartveneman/gromit-cli.svg)

A test framework to assert that CSS doesn't exceed provided thresholds.

- Provide a [config file](#config-file) with thresholds to check
- Pass in the CSS
- Gromit will let you know whether your CSS passes the test

## Usage

Gromit needs CSS input and a config file.

```sh
# Default usage (assuming a .gromitrc file in the current directory)
$ gromit style.css

# Read from StdIn (assuming a .gromitrc file in the current directory)
$ cat style.css | gromit

# Custom config
$ gromit style.css --config my-config.json
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
	// Do not exceed 4095, otherwise IE9 will drop any subsequent rules
	"selectors.total": 4095,
	"selectors.id.total": 0,
	"values.colors.totalUnique": 2,
	"values.colors.unique": ["#fff", "#000"]
}
```

All the possible options for the config file can be found at
[@projectwallace/css-analyzer](https://github.com/projectwallace/css-analyzer#usage).

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

## Related projects

- [CSS Analyzer](https://github.com/projectwallace/css-analyzer) - The analyzer
  that powers this module
- [Wallace](https://github.com/bartveneman/wallace-cli) - CLI tool for
  @projectwallace/css-analyzer
- [CSS Analyzer Diff](https://github.com/bartveneman/css-analyzer-diff) -
  Calculates the diff between two sets of CSS analysis
- [Color Sorter](https://github.com/bartveneman/color-sorter) - Sort CSS colors
  by hue, saturation, lightness and opacity

## License

MIT © Bart Veneman
