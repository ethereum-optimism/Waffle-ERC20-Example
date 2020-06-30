const { MockProvider } = require('ethereum-waffle')
const { addHandlerToProvider } = require('@eth-optimism/rollup-full-node')

const getProvider = async () => {
	let provider = new MockProvider()
	if (process.env.MODE === 'OVM') {
		provider = await addHandlerToProvider(provider)
	}
	return provider
}

module.exports = { getProvider }
