/* External imports */
import { expect, use } from 'chai'
import { ethers, Wallet, Signer } from 'ethers'
import { JsonRpcProvider } from '@ethersproject/providers'
import { BigNumber } from '@ethersproject/bignumber'
import { solidity } from 'ethereum-waffle'
import 'dotenv/config'

/* Internal imports */
import { ERC20 } from '../types'
import { getArtifact } from './utils'

use(solidity)

describe('ERC20', () => {
  let ERC20: ERC20,
    provider: JsonRpcProvider,
    walletAddress: string,
    walletToAddress: string

  const privateKey: string = ethers.Wallet.createRandom().privateKey
  const useL2: boolean = (process.env.TEST_MODE === 'OVM')

  if (useL2 == true) {
    provider = new ethers.providers.JsonRpcProvider(process.env.L2_WEB3_URL)
  } else {
    provider = new ethers.providers.JsonRpcProvider(process.env.L1_WEB3_URL)
  }

  const wallet: Signer = new ethers.Wallet(process.env.USER_PRIVATE_KEY, provider)
  const walletTo: Signer = new ethers.Wallet(privateKey, provider)

  // parameters to use for our test coin
  const COIN_NAME = 'OVM Test Coin'
  const TICKER = 'OVM'
  const NUM_DECIMALS = 1

  describe('when using a deployed contract instance', () => {
    before(async () => {
      walletAddress = await wallet.getAddress()
      walletToAddress = await walletTo.getAddress()

      const ERC20_Artifact = getArtifact(process.env.TEST_MODE)
      const ERC20_Factory = new ethers.ContractFactory(
        ERC20_Artifact.abi,
        ERC20_Artifact.bytecode,
        wallet
      )

      ERC20 = await ERC20_Factory
        .connect(wallet)
        .deploy(1000, COIN_NAME, NUM_DECIMALS, TICKER) as ERC20

      ERC20.deployTransaction.wait()
    })

    it('should assign initial balance', async () => {
      const initialBalance = await ERC20.balanceOf(walletAddress)
      expect(initialBalance).to.equal(1000)
    })

    it('should correctly set vanity information', async () => {
      const name = await ERC20.name()
      const decimals = await ERC20.decimals()
      const symbol = await ERC20.symbol()

      expect(name).to.equal(COIN_NAME)
      expect(decimals).to.equal(NUM_DECIMALS)
      expect(symbol).to.equal(TICKER)
    })

    it('should call transfer to add amount to destination account', async () => {
      await ERC20.connect(wallet).transfer(walletToAddress, 7)
      const walletToBalance: BigNumber = await ERC20.balanceOf(walletToAddress)
      expect(walletToBalance.toString()).to.equal('7')
    })

    // Compare with how Synthetix tests event emissions
    it('should emit a Transfer event when transfer is called', async () => {
      const tx = ERC20.connect(wallet).transfer(walletToAddress, 7)
      await expect(tx)
        .to.emit(ERC20, 'Transfer')
        .withArgs(walletAddress, walletToAddress, 7)
    })

    it('should not transfer above the amount', async () => {
      const tx = ERC20.connect(wallet).transfer(walletToAddress, 1007)
      await expect(tx).to.be.reverted
    })

    it('should not transfer from empty account', async () => {
      const ERC20FromOtherWallet = ERC20.connect(walletTo)
      const tx = ERC20FromOtherWallet.transfer(walletAddress, 1)

      await expect(tx).to.be.reverted
    })
  })
})
