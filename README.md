# Wallets Demo

This demo is built using the following resources:

- [Stellar JS SDK](https://github.com/stellar/js-stellar-sdk)
- [Freighter SDK](https://github.com/stellar/freighter)
- [Passkey Kit](https://github.com/kalepail/passkey-kit)
- [Launchtube](https://github.com/stellar/launchtube)
- [Next.js](https://nextjs.org/)




## Prerequisite
Follow this guide to get the Stellar CLI, user account etc. setup: [Getting Started - Setup](https://developers.stellar.org/docs/build/smart-contracts/getting-started/setup)

The Stellar CLI is used to build, deploy and invoke smart contracts, so even though this demo is focusing on the frontend and wallet integration, the demo depends on having a smart contract deployed.

## Deploy the Increment smart contract
The wallets demo depends on the [increment](https://github.com/stellar/soroban-examples/tree/main/increment) smart contract from the Stellar [soroban examples](https://github.com/stellar/soroban-examples) repo. 

### Clone repo
First you clone the repo, and go to the `increment` project:

```bash
git clone https://github.com/stellar/soroban-examples.git
cd increment
```

### Build the smart contract
Next we build the project using the Stellar CLI:

```bash
stellar contract build
```

### Deploy the smart contract
Next we deploy the smart contract to the network. The contract can be deployed to the Testnet or the Mainnet, for this example we deploy it to the Testnet:

```bash
stellar contract deploy \
  --wasm target/wasm32v1-none/release/<project_name>.wasm \
  --source alice \
  --network testnet \
  --alias <project_name>
```

### Test the smart contract
Now the `increment` smart contract has been deployed, we can invoke it to test it:

```bash
stellar contract invoke \
  --id <project_name> \
  --source alice \
  --network testnet \
  -- \
  hello \
  --to RPC
```

## TypeScript bindings
The Stellar CLI has a built-in feature to create an NPM package that makes smart contract function invocations in the frontend possible.

See this step-by-step guide: [TypeScript Bindings Cheat-Sheet](https://github.com/carstenjacobsen/stellar-cheat-sheet/blob/main/frontend-bindings.md)





