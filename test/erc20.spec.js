/* External imports */
require('dotenv/config')
const { use, expect } = require('chai')
const { ethers } = require('ethers')
const { solidity } = require('ethereum-waffle')

/* Internal imports */
const { getArtifact } = require('./getArtifact')

use(solidity)

describe('ERC20 smart contract', () => {
  let ERC20,
    provider,
    wallet,
    walletTo,
    walletAddress,
    walletToAddress

  const privateKey = ethers.Wallet.createRandom().privateKey
  const useL2 = (process.env.TARGET === 'OVM')

  if (useL2 == true) {
    provider = new ethers.providers.JsonRpcProvider(
      process.env.OPTIMISTIC_ETHEREUM_JSON_RPC_PROVIDER
    )
  } else {
    provider = new ethers.providers.JsonRpcProvider(
      process.env.ETHEREUM_JSON_RPC_PROVIDER
    )
  }

  wallet = new ethers.Wallet(process.env.USER_PRIVATE_KEY, provider)
  walletTo = new ethers.Wallet(privateKey, provider)

  // parameters to use for our test coin
  const COIN_NAME = 'OVM Test Coin'
  const TICKER = 'OVM'
  const NUM_DECIMALS = 1


  describe('when using a deployed contract instance', () => {
    before(async () => {
      walletAddress = await wallet.getAddress()
      walletToAddress = await walletTo.getAddress()

      const Artifact__ERC20 = getArtifact(process.env.TARGET)
      const Factory__ERC20 = new ethers.ContractFactory(
        Artifact__ERC20.abi,
        Artifact__ERC20.bytecode,
        wallet
      )

      ERC20 = await Factory__ERC20
        .connect(wallet)
        .deploy(1000, COIN_NAME, NUM_DECIMALS, TICKER)

      ERC20.deployTransaction.wait()
    })

    it('should assigns initial balance', async () => {
      expect(await ERC20.balanceOf(wallet.address)).to.equal(1000)
    })

    it('should correctly set vanity information', async () => {
      const name = await ERC20.name()
      expect(name).to.equal(COIN_NAME)

      const decimals = await ERC20.decimals()
      expect(decimals).to.equal(NUM_DECIMALS)

      const symbol = await ERC20.symbol()
      expect(symbol).to.equal(TICKER)
    })


    it('should transfer amount to destination account', async () => {
      const tx = await ERC20.connect(wallet).transfer(walletToAddress, 7)
      await tx.wait()
      const walletToBalance = await ERC20.balanceOf(walletToAddress)
      expect(walletToBalance.toString()).to.equal('7')
    })

    it('should emit Transfer event', async () => {
      const tx = ERC20.connect(wallet).transfer(walletToAddress, 7)
      await expect(tx)
        .to.emit(ERC20, 'Transfer')
        .withArgs(walletAddress, walletToAddress, 7)
    })

    it('should not transfer above the amount', async () => {
      await expect(ERC20.transfer(walletTo.address, 1007)).to.be.reverted
    })

    it('should not transfer from empty account', async () => {
      if (useL2 == true) {
        const walletToBalanceBefore = await ERC20.balanceOf(walletToAddress)
        const ERC20FromOtherWallet = ERC20.connect(walletTo)
        const tx = await ERC20FromOtherWallet.transfer(walletAddress, 1)
        await tx.wait()
        const walletToBalanceAfter = await ERC20.balanceOf(walletToAddress)
        expect(walletToBalanceBefore).to.eq(walletToBalanceBefore)
      } else {
        const ERC20FromOtherWallet = ERC20.connect(walletTo)
        const tx = ERC20FromOtherWallet.transfer(walletAddress, 1)
        await expect(tx).to.be.reverted
      }
    })
  })
})