import { createWallet } from "arweavekit/wallet";
import { createContract } from "arweavekit/contract";
import crypto from "crypto";

async function createContractTestNet(wallet) {
  const { contract, result } = await createContract({
    environment: "testnet",
    wallet,
    initialState: JSON.stringify({ counter: 0 }),
    strategy: "arweave",
    contractSource: `
export function handle(state, action) {
  if (action.input.function === 'decrement') {
    state.counter -= 1
  }
  if (action.input.function === 'increment') {
    state.counter += 1
  }

  return { state }
}`,
  });

  console.log(result, contract);
}

(async () => {
  const { key: arWallet } = await createWallet({ environment: "mainnet" });
  createContractTestNet(arWallet);
  const ethWallet = crypto.randomBytes(32).toString("hex");
  createContractTestNet(ethWallet);
})();
