# Getting Started with the OVM: Simple ERC20 Token Waffle Tutorial

Hi there! Welcome to our OVM ERC20 Waffle tutorial.

If your preferred smart contract testing framework is Truffle, see our OVM ERC20 Truffle tutorial [here](https://github.com/ethereum-optimism/Truffle-ERC20-Example).

If you're interested in writing your first L2-compatible smart contract using Waffle as your smart contract testing framework, then you've come to the right place!
This repo serves as an example for how to compile, deploy, and test your contracts for the OVM.

## Prerequisite Software

In this tutorial, we will be making use of external software, so make sure you've installed these before continuing:

* [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
* Latest version of [Node.js](https://nodejs.org/en/)
* [Yarn 1](https://classic.yarnpkg.com/en/docs/install#mac-stable)

### TypeScript

Also, since this project relies on using TypeScript, we expect that you are already familiar with how to write applications using TypeScript.
If are not familiar with TypeScript, we recommend reading through this brief [TypeScript for JavaScript Programmers](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html) as a primer.

## Setup

The structure of this example will be similar to the [`optimism-tutorial`](https://github.com/ethereum-optimism/optimism-tutorial), a complete beginner's guide on how to compile, deploy, and test your contracts to and on the **O**ptimistic **V**irtual **M**achine.
However, this example is slightly trimmed to be more of a reference than a complete guide.
Nonetheless, if you're completely new to compiling, deploying, and testing your Ethereum for the OVM, don't worry!
We've got you covered in this example.

To start, please clone and enter this Waffle-ERC20-Example repository:

```sh
git clone https://github.com/ethereum-optimism/Waffle-ERC20-Example.git
cd optimism-tutorial
```

Then, install all of the project's dependencies:

```sh
yarn install
```

## Compiling for Ethereum and Optimistic Ethereum

Whether you are compiling contracts for the EVM and OVM, the only thing you need to exclude or include is the flag, `TEST_MODE=OVM`, on the command line.

Including this flag tells Waffle that we want to use our `waffle-ovm.json` config file to compile our ERC20 contract for Optimistic Ethereum.
And, excluding this flag tells Waffle that want to use `waffle.json` to compile for vanilla Ethereum.

Let's compile our ERC20 contract for Ethereum and Optimistic Ethereum using these two commands:

```sh
yarn build:evm
yarn build:ovm
```

After running these Waffle build commands, you should see two separate build paths in your project's directory, one named `build`, which contains the contract artifacts for the EVM, and another named `build-ovm`, which contains the artifacts for the OVM.

## Deploying to Ethereum and Optimistic Ethereum

### Setting up the integrations repository

Since we want to be deploying our ERC20 contract to both Ethereum and Optimistic Ethereum, we'll need some way to replicate a local environment that with both chains for us to interact with.

Thankfully, Optimism has made a set of docker containers for this exact purpose.
The repository, [`optimism-integration`](https://github.com/ethereum-optimism/optimism-integration.git) (also known as the "integrations repo"), provides several docker containers to serve as part of your OVM developer toolkit when developing locally.
When its containers are started, it spins up both a local Ethereum (EVM) L1 chain and a local Optimistic Ethereum (OVM) L2 chain.
These chains are where we'll be deploying our contracts to.
So, let's get to deploying your simple ERC20 contract to the EVM!

### Deploying a contract

To deploy a contract to Ethereum. 

## Writing EVM-integration tests


## Deploying contracts to the OVM


## Writing OVM-integration tests


## OVM vs. EVM Incompatibilities
Our goal is to bring the OVM as close to 100% compatibility with all existing Ethereum projects, but our software is still in an early stage. [This document](https://hackmd.io/elr0znYORiOMSTtfPJVAaA) will maintain the most up to date list of known incompatibilities between the OVM and EVM, along with our plans to fix them.

<!-- ## How to uncover OVM bugs
Most likely, all of your tests will be passing in the EVM, but not all of your tests will be passing in the OVM. We recommend isolating issues by running the single failing tests and commenting out parts of contracts until you narrow down what line(s) of Solidity are causing the discrepancy between the EVM and OVM. Then, hop in our [Discord](https://discordapp.com/invite/jrnFEvq) and share the bug you've uncovered and we'll fix it as soon as possible. -->

## Wasn't that easy?
The OVM provides a fresh new take on layer 2 development: it's identical to layer 1 development.  No hoops, no tricks--the Ethereum you know and love, ready to scale up with L2.  For more info on our progress and what's going on behind the scenes, you can follow us on [Twitter](https://twitter.com/optimismPBC) and [check out our docs](http://community.optimism.io/)!

## Troubleshooting

Example project not working? [Create a Github Issue](https://github.com/ethereum-optimism/ERC20-Example/issues), or hop in our [Discord](https://discordapp.com/invite/jrnFEvq) channel and ask away.
