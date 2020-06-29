const { use, expect } = require('chai');
const { solidity, deployContract } = require('ethereum-waffle');
const { getProvider } = require('./setup')
const ERC20 = require('../build/ERC20.json');

use(solidity);

describe('ERC20 smart contract', () => {
  let provider
  let wallet, walletTo

  before(async () => {
    provider = await getProvider()
    const wallets = provider.getWallets()
    wallet = wallets[0]
    walletTo = wallets[1]
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
    expect(await token.balanceOf(wallet.address)).to.equal(1000);
  });

  it('Correctly sets vanity information', async () => {
    const name = await token.name();
    expect(name).to.equal(COIN_NAME);

    const decimals = await token.decimals();
    expect(decimals).to.equal(NUM_DECIMALS);

    const symbol = await token.symbol();
    expect(symbol).to.equal(TICKER);
  });


  it('Transfer adds amount to destination account', async () => {
    await token.transfer(walletTo.address, 7);
    expect(await token.balanceOf(walletTo.address)).to.equal(7);
  });

  it('Transfer emits event', async () => {
    await expect(token.transfer(walletTo.address, 7))
      .to.emit(token, 'Transfer')
      .withArgs(wallet.address, walletTo.address, 7);
  });

  it('Can not transfer above the amount', async () => {
    await expect(token.transfer(walletTo.address, 1007)).to.be.reverted;
  });

  it('Can not transfer from empty account', async () => {
    const tokenFromOtherWallet = token.connect(walletTo);
    await expect(tokenFromOtherWallet.transfer(wallet.address, 1))
      .to.be.reverted;
  });
});

