import { encryptDataWithAES, decryptDataWithAES } from "arweavekit/encryption";

async function run() {
  function arraybufferEqual(buf1, buf2) {
    if (buf1 === buf2) {
      return true;
    }

    if (buf1.byteLength !== buf2.byteLength) {
      return false;
    }

    var view1 = new DataView(buf1);
    var view2 = new DataView(buf2);

    var i = buf1.byteLength;
    while (i--) {
      if (view1.getUint8(i) !== view2.getUint8(i)) {
        return false;
      }
    }

    return true;
  }

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
    `Encrypted and Decrypted successfully?: ${arraybufferEqual(
      dataToEncrypt,
      decryptedData
    )}`
  );
}

run()
  .then(() => console.log("Worked"))
  .catch((e) => console.log("Failed with", e.message));
