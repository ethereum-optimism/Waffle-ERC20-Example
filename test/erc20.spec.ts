/* External imports */
import { expect, use } from 'chai'
import { ethers, Wallet, Signer } from 'ethers'
import { JsonRpcProvider } from '@ethersproject/providers'
import { solidity, deployContract } from 'ethereum-waffle'
import 'dotenv/config'

/* Internal imports */
import { ERC20 } from '../types'
const buildFolder = (process.env.TEST_MODE === 'OVM') ? 'build-ovm' : 'build'
const ERC20Aritfact = require(`../${ buildFolder }/ERC20.json`)

use(solidity)

describe('ERC20 smart contract', () => {
  let ERC20: any,
    provider: JsonRpcProvider

  const privateKey1: string = ethers.Wallet.createRandom().privateKey
  const privateKey2: string = ethers.Wallet.createRandom().privateKey
  const useL2: boolean = (process.env.TEST_MODE === 'OVM')

  if (useL2 == true) {
    provider = new ethers.providers.JsonRpcProvider(process.env.L2_WEB3_URL)
  } else {
    provider = new ethers.providers.JsonRpcProvider(process.env.L1_WEB3_URL)
  }

  /**
   * @dev NEED TO CREATE WALLETS WITH BALANCES COVER CONTRACT DEPLOYMENT COST
   */
  const wallet: Signer = new ethers.Wallet(privateKey1, provider)
  const walletTo: Signer = new ethers.Wallet(privateKey2, provider)

  before(async () => {
    console.log('Wallet balance: ', (await wallet.getBalance()).toString())
    console.log('WalletTo balance: ', (await walletTo.getBalance()).toString())
  })

  // parameters to use for our test coin
  const COIN_NAME = 'OVM Test Coin'
  const TICKER = 'OVM'
  const NUM_DECIMALS = 1

  /* Deploy a new ERC20 Token  */
  before(async () => {
    ERC20 = await deployContract(wallet, ERC20Aritfact, [1000, COIN_NAME, NUM_DECIMALS, TICKER]) as ERC20

    console.log('\n \n The deployed contract: \n', ERC20)
  })

  it('Assigns initial balance', async () => {
    expect(await ERC20.balanceOf(wallet.getAddress())).to.equal(1000)
  })

  it('Correctly sets vanity information', async () => {
    const name = await ERC20.name()
    expect(name).to.equal(COIN_NAME)

    const decimals = await ERC20.decimals()
    expect(decimals).to.equal(NUM_DECIMALS)

    const symbol = await ERC20.symbol()
    expect(symbol).to.equal(TICKER)
  })


  it('Transfer adds amount to destination account', async () => {
    await ERC20.transfer(walletTo.getAddress(), 7)
    expect(await ERC20.balanceOf(walletTo.getAddress())).to.equal(7)
  })

  it('Transfer emits event', async () => {
    await expect(ERC20.transfer(walletTo.getAddress(), 7))
      .to.emit(ERC20, 'Transfer')
      .withArgs(wallet.getAddress(), walletTo.getAddress(), 7)
  })

  it('Can not transfer above the amount', async () => {
    await expect(ERC20.transfer(walletTo.getAddress(), 1007)).to.be.reverted
  })

  it('Can not transfer from empty account', async () => {
    const ERC20FromOtherWallet = ERC20.connect(walletTo)
    await expect(ERC20FromOtherWallet.transfer(wallet.getAddress(), 1))
      .to.be.reverted
  })
})

