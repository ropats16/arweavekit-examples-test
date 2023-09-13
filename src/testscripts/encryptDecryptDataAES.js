import { encryptDataWithAES, decryptDataWithAES } from "arweavekit/encryption";

async function run() {
  const dataToEncrypt = new TextEncoder().encode("Hello World!").buffer;

  const { rawEncryptedKeyAsBase64, combinedArrayBuffer } =
    await encryptDataWithAES({
      data: dataToEncrypt,
    });

  const decryptedData = await decryptDataWithAES({
    data: combinedArrayBuffer,
    key: rawEncryptedKeyAsBase64,
  });

  console.log(
    `Encrypted and Decrypted successfully?: ${
      // eslint-disable-next-line no-undef
      Buffer.from(dataToEncrypt).compare(Buffer.from(decryptedData)) === 0
    }`
  );
}

run()
  .then(() => console.log("Worked"))
  .catch((e) => console.log("Failed with", e.message));
