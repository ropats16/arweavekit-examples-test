import { writeContract } from "arweavekit/contract";
import { createWallet } from "arweavekit/wallet";
import crypto from "crypto";

async function writeContractTestNet(wallet) {
  const response = await writeContract({
    wallet,
    environment: "testnet",
    contractTxId: "CO7NkmEVj4wEwPySxYUY0_ElrEqU4IeTglU2IilCnLA",
    options: {
      function: "increment",
    },
    strategy: "arweave",
    cacheOptions: { inMemory: true },
  });

  console.log(response);
}

(async () => {
  const { key: arWallet } = await createWallet({ environment: "mainnet" });
  writeContractTestNet(arWallet);
  const ethWallet = crypto.randomBytes(32).toString("hex");
  writeContractTestNet(ethWallet);
})();
