# Getting Started with the OVM: Simple ERC20 Token Tutorial

Hi there! Welcome to our OVM ERC20 tutorial.

If you're interested in writing your first L2-compatible smart contract, you've come to the right place!  This tutorial will cover how to move an existing contract and its tests into the wonderful world of L2.

## Set up

To start out, clone this example repo as a starting point.

```bash
git clone https://github.com/ethereum-optimism/ERC20-Example.git
```
Now, enter the repository

```bash
cd ERC20-Example
```
Install all dependencies

```bash
yarn install
```

This project represents a fresh, non-OVM ERC20 contract example. Feel free to stop here and have a quick look at the contract and tests. 

In this tutorial, we'll cover the steps required to bring it into the world of L2. First, let's make sure all of our tests are running in our normal Ethereum environment: 

```bash
yarn all
```

You should see all of the tests passing. We're now ready to convert the project to build and test in an OVM environment!


## Wasn't that easy?
The OVM provides a fresh new take on layer 2 development: it's identical to layer 1 development.  No hoops, no tricks--the Ethereum you know and love, ready to scale up with L2.  For more info on our progress and what's going on behind the scenes, you can follow us on [Twitter](https://twitter.com/optimismPBC) and [check out our docs](https://docs.optimism.io)!

## Troubleshooting

Still not working? [Create a Github Issue](https://github.com/ethereum-optimism/ERC20-Example/issues), or hop in our [Discord](https://discordapp.com/invite/jrnFEvq) channel and ask away.
