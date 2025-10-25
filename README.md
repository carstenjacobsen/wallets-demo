# Wallets Demo

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





## Next.js stuff

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

### Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

### Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
