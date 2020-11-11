const { MockProvider } = require('ethereum-waffle')

const getProvider = async () => {
	let provider = new MockProvider()
	return provider
}

module.exports = { getProvider }
