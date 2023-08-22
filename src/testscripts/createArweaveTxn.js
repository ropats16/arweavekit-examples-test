import fs from "fs";
import path from "path";
import { getAddress, getBalance } from "arweavekit/wallet";
import { createTransaction } from "arweavekit/transaction";

async function run() {
  const __dirname = path.resolve();

  // Reading wallet balance
  const key = JSON.parse(
    fs.readFileSync(path.join(__dirname, "./wallet.json")).toString()
  );

  const walletAddress = await getAddress({ environment: "mainnet", key: key });

  const walletBalance = await getBalance({
    address: walletAddress,
    environment: "mainnet",
  });
  console.log("wallet balance ", walletBalance);

  // dummy definitions
  const filePath = "./src/assets/Bundlr.png";
  const metaData = [
    { name: "Creator", value: walletAddress },
    { name: "Title", value: "Bundlr PNG" },
    { name: "Content-Type", value: "image/png" },
  ];

  // handling file
  const data = fs.readFileSync(path.join(__dirname, filePath));

  // Posting transaction
  const transaction = await createTransaction({
    data: data,
    key: key,
    type: "data",
    environment: "mainnet",
    options: {
      tags: metaData,
      signAndPost: true,
    },
  });

  console.log("Transaction uploaded", transaction);
}

run()
  .then(() => console.log("Worked"))
  .catch((e) => console.log("Failed with", e.message));
