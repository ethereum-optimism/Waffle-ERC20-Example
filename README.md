# Getting Started with the OVM: Simple ERC20 Token Waffle Tutorial

Hi there! Welcome to our OVM ERC20 Waffle example!

If your preferred smart contract testing framework is Truffle, see our OVM ERC20 Truffle tutorial here (todo).
If you're interested in writing your first L2-compatible smart contract using Waffle as your smart contract testing framework, then you've come to the right place!
This repo serves as an example for how go through and compile/test/deploy your contracts on both Ethereum and Optimistic Ethereum.

Note that this process is only to give a side-by-side comparison and is _not_ necessary for you to build an application on Optimistic Ethereum. With that out of the way, let's begin!

## Prerequisites

Please make sure you've installed the following before continuing:

- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [Node.js](https://nodejs.org/en/download/)
- [Yarn 1](https://classic.yarnpkg.com/en/docs/install#mac-stable)
- [Docker](https://docs.docker.com/engine/install/)

## Set up

To start, clone this `Waffle-ERC20-Example` repo, enter it, and install all of its dependencies:

```sh
git clone https://github.com/ethereum-optimism/ERC20-Example.git
cd Waffle-ERC20-Example
yarn install
```

Then, copy the `.env-example` file and rename it `.env`, like so:

```sh
cp .env-example .env
```

This will give us our environment variables that we'll use later on.

## Step 1: Compile your contracts

### Compile an Ethereum contract

Just like with any other project, we'll first need to compile our Solidity into EVM bytecode.
Let's compile our ERC20 contract by running the following command:

```sh
yarn waffle waffle.json
```

You should now see a new `build-ovm` directory which has some JSON files in it.
If you can see this directory, you're ready to move onto the next section!

### Compile an Optimistic Ethereum contract

Compiling a contract for Optimistic Ethereum is pretty easy!
First we'll need to install the [`@eth-optimism/solc`](https://www.npmjs.com/package/@eth-optimism/solc) and `solc` packages.
Since we currently only support `solc` versions `0.5.16`, `0.6.12`, and `0.7.6` for Optimistic Ethereum contracts, we'll be using version `0.7.6` in this example.
Let's add these two packages:

```sh
yarn add @eth-optimism/solc@0.7.6-alpha.1
yarn add solc@0.7.6
```

Next we just need to add a new Waffle config to compile our contracts. Create `waffle-ovm.json` and add this to it:

```json
{
  "compilerVersion": "./node_modules/@eth-optimism/solc",
  "sourceDirectory": "./contracts",
  "outputDirectory": "./build-ovm"
}
```

Here, we specify the new custom Optimistic Ethereum compiler we just installed and the new build path for our optimistically compiled contracts.

And we're ready to compile! All you have to do is specify the `waffle-ovm.json` config in your `waffle` command:

```sh
yarn waffle waffle-ovm.json
```

Our `waffle-ovm.json` config file tells Waffle that we want to use the Optimistic Ethereum solidity compiler.

Yep, it's that easy. You can verify that everything went well by looking for the `build-ovm` directory.

Here, `build-ovm` signifies that the contracts contained in this directory have been compiled for the OVM, the Optimistic Virtual Machine, as opposed to the Ethereum Virtual Machine. Now let's move on to testing!

## Step 2: Test your contracts

### Test an Ethereum contract

Testing with Waffle is easy. We've included a simple set of ERC20 tests inside `Waffle-ERC20-Example/test/erc20.spec.js`. Let's run these tests with `waffle`:

```sh
yarn TARGET=EVM mocha 'test/*.spec.js' --timeout 10000
```

Notice that we're using a `TARGET=EVM` flag to let `mocha` know that we want to run this test for the EVM.

If everything went well, you should see a bunch of green checkmarks.

### Testing an Optimistic Ethereum contract

Woot! It's finally time to test our contract on top of Optimistic Ethereum.
But first we'll need to get a local version of an Optimistic Ethereum node running...

-------

Fortunately, we have a handy dandy repository that makes it easy to spin up a local Optimistic Ethereum node!

Since we're going to be using Docker, make sure that Docker is installed on your machine prior to moving on (info on how to do that here).

Now we just need to install our Optimistic Ethereum node by running:

```sh
git clone git@github.com:ethereum-optimism/optimism-integration.git --recurse-submodules
cd optimism-integration
./pull.sh
```

`./pull.sh` will pull the latest version of all of our docker images and make sure everything else is up to date.

Then we'll run the `./up.sh` command to spin up our node:

```sh
./up.sh
```

Give `./up.sh` a little bit to fully start up (could be up to ~30 seconds).
We'll need to keep this terminal running for the rest of this tutorial (it's your Optimistic Ethereum node). Go ahead and open up a second terminal so that you can run more commands while the other terminal is still running.

You now have your very own locally deployed instance of Optimistic Ethereum! 🙌

-------

With your local instance of Optimistic Ethereum up and running, let's test your contracts! Since the two JSON RPC provider URLs (one for your local instance Ethereum and Optimistic Ethereum) have already been specified in your `.env` file, all we need to do next is run the test command.

To do that, run:

```sh
yarn TARGET=OVM mocha 'test/*.spec.js' --timeout 50000
```

Instead of using the `TARGET=EVM` flag, here we use the `TARGET=OVM` flag to let `mocha` know that we want to use the `build-ovm` folder as our path to our JSON files.
(Remember that these JSON files were compiled using the Optimistic Ethereum solidity compiler!)

You should see another set of passing tests. If so, congrats!
You're ready to deploy an application to Optimistic Ethereum.
It really is that easy.

------

## Further Reading

### OVM vs. EVM Incompatibilities

Our goal is to bring the OVM as close to 100% compatibility with all existing Ethereum projects, but our software is still in an early stage. [This document](https://hackmd.io/elr0znYORiOMSTtfPJVAaA) will maintain the most up to date list of known incompatibilities between the OVM and EVM, along with our plans to fix them.

### Wasn't that easy?

The OVM provides a fresh new take on layer 2 development: it's identical to layer 1 development.
No hoops, no tricks--the Ethereum you know and love, ready to scale up with L2.
For more info on our progress and what's going on behind the scenes, you can follow us on [Twitter](https://twitter.com/optimismPBC).

Want to try deploying contracts to the Optimistic Ethereum testnet next? [Check out the full integration guide](https://community.optimism.io/docs/developers/integration.html) on the Optimism community hub.

------

## Troubleshooting

Example project not working? [Create a Github Issue](https://github.com/ethereum-optimism/ERC20-Example/issues), or hop in our [Discord](https://discordapp.com/invite/jrnFEvq) channel and ask away.
