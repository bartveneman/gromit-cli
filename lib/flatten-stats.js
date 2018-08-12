const flatten = require('flat')

module.exports = stats => {
	return Object.entries(flatten(stats, {safe: true}))
		.map(([key, stat]) => {
			if (key.includes('unique')) {
				return {
					key,
					stat: stat.map(item => item.value || item.selector)
				}
			}

			return {key, stat}
		})
		.reduce((acc, curr) => {
			acc[curr.key] = curr.stat
			return acc
		}, {})
}
