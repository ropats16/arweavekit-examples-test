import {
  encryptAESKeywithRSA,
  decryptAESKeywithRSA,
} from "arweavekit/encryption";
import { createWallet } from "arweavekit/wallet";

async function run() {
  const keyToEncrypt = "ArweaveKit";

  const { key: wallet } = await createWallet({ environment: "mainnet" });

  const encryptedKey = await encryptAESKeywithRSA({
    key: keyToEncrypt,
    wallet,
  });

  const decryptedKey = await decryptAESKeywithRSA({
    key: encryptedKey,
    wallet,
  });

  console.log({
    encryptedKey,
    keyToEncrypt,
    decryptedKey,
  });
}

run()
  .then(() => console.log("Worked"))
  .catch((e) => console.log("Failed with", e.message));
