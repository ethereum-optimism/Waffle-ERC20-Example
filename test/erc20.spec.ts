/* External imports */
import { expect } from 'chai'
import { ethers, Wallet, Signer } from 'ethers'
import { JsonRpcProvider } from '@ethersproject/providers'
import { solidity, deployContract } from 'ethereum-waffle'
import 'dotenv/config'

/* Internal imports */
const buildFolder = (process.env.TEST_MODE === 'OVM') ? 'build-ovm' : 'build'
const ERC20 = require(`../${ buildFolder }/ERC20.json`)

// use(solidity)

describe('ERC20 smart contract', () => {
  let provider: JsonRpcProvider,
    wallet: Wallet,
    walletTo: Wallet

  // // For the Optimistic test file
  const privateKey1: string = ethers.Wallet.createRandom().privateKey
  const privateKey2: string = ethers.Wallet.createRandom().privateKey
  const privateKey3: string = ethers.Wallet.createRandom().privateKey

  before(async () => {
    if (process.env.TEST_MODE === 'OVM') {
      provider = new ethers.providers.JsonRpcProvider(process.env.L2_WEB3_URL)
    } else {
      provider = new ethers.providers.JsonRpcProvider(process.env.L1_WEB3_URL)
    }

    // Signers
    const account1: Signer = new ethers.Wallet(privateKey1, provider)
    const account2: Signer = new ethers.Wallet(privateKey2, provider)
    const account3: Signer = new ethers.Wallet(privateKey3, provider)
    // const wallets = provider.getWallets()
    // wallet = wallets[0]
    // walletTo = wallets[1]
  })

  // parameters to use for our test coin
  const COIN_NAME = 'OVM Test Coin'
  const TICKER = 'OVM'
  const NUM_DECIMALS = 1
  let token

  /* Deploy a new ERC20 Token before each test */
  beforeEach(async () => {
    token = await deployContract(wallet, ERC20, [1000, COIN_NAME, NUM_DECIMALS, TICKER])
  })

  it('Assigns initial balance', async () => {
    expect(await token.balanceOf(wallet.address)).to.equal(1000)
  })

  it('Correctly sets vanity information', async () => {
    const name = await token.name()
    expect(name).to.equal(COIN_NAME)

    const decimals = await token.decimals()
    expect(decimals).to.equal(NUM_DECIMALS)

    const symbol = await token.symbol()
    expect(symbol).to.equal(TICKER)
  })


  it('Transfer adds amount to destination account', async () => {
    await token.transfer(walletTo.address, 7)
    expect(await token.balanceOf(walletTo.address)).to.equal(7)
  })

  it('Transfer emits event', async () => {
    await expect(token.transfer(walletTo.address, 7))
      .to.emit(token, 'Transfer')
      .withArgs(wallet.address, walletTo.address, 7)
  })

  it('Can not transfer above the amount', async () => {
    await expect(token.transfer(walletTo.address, 1007)).to.be.reverted
  })

  it('Can not transfer from empty account', async () => {
    const tokenFromOtherWallet = token.connect(walletTo)
    await expect(tokenFromOtherWallet.transfer(wallet.address, 1))
      .to.be.reverted
  })
})

