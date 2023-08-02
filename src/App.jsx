import { Othent } from "arweavekit/auth";
import { useState } from "react";
import {
  createTransaction,
  signTransaction,
  postTransaction,
} from "arweavekit/transaction";

async function logIn() {
  const userDetails = await Othent.logIn({
    apiId: import.meta.env.VITE_OTHENT_API_ID,
  });

  console.log("Othent Login details", userDetails);
}

async function logOut() {
  await Othent.logOut({
    apiId: import.meta.env.VITE_OTHENT_API_ID,
  });

  console.log("Logged out of Othent");
}

const toArrayBuffer = (file) =>
  new Promise((resolve) => {
    const fr = new FileReader();
    fr.readAsArrayBuffer(file);
    fr.addEventListener("loadend", (evt) => {
      resolve(evt.target.result);
    });
  });

function App() {
  const [files, setFiles] = useState(null);
  function handleFileChange(e) {
    setFiles(e.target.files);
  }

  async function createArweaveTransaction() {
    try {
      console.log(files[0]);
      const data = await toArrayBuffer(files[0]);
      console.log(data);
      const metaData = [
        { name: "Creator", value: window.arweaveWallet.getActiveAddress },
        { name: "Title", value: "Bundlr PNG" },
        { name: "Content-Type", value: "image/png" },
      ];
      const transaction = await createTransaction({
        data: data,
        type: "data",
        environment: "mainnet",
        options: {
          tags: metaData,
        },
      });
      console.log(transaction);
      const signedTransaction = await signTransaction({
        environment: "mainnet",
        createdTransaction: transaction,
      });
      console.log("Signed", signedTransaction);
      const postedTransaction = await postTransaction({
        environment: "mainnet",
        transaction: signedTransaction,
      });
      console.log("Posted", postedTransaction);
      console.log("Posted", transaction.id);
      // Example successful id: https://a6gp5qkf2e6mpljgb5ahyk2nobkgtp2zkdqvh2jc6u7j4occw6ha.arweave.net/B4z-wUXRPMetJg9AfCtNcFRpv1lQ4VPpIvU-njhCt44
    } catch (error) {
      console.log("Transaction failed due to:", error.message);
    }
  }

  async function createBundlrTransaction() {
    try {
      console.log(files[0]);
      const data = await toArrayBuffer(files[0]);
      console.log(data);
      const metaData = [
        {
          name: "Creator",
          value: window.arweaveWallet
            ? window.arweaveWallet.getActiveAddress
            : "Anon",
        },
        { name: "Title", value: "Bundlr PNG" },
        { name: "Content-Type", value: "image/png" },
      ];
      const transaction = await createTransaction({
        data: data,
        type: "data",
        environment: "mainnet",
        options: {
          tags: metaData,
          useBundlr: true,
          signAndPost: true,
        },
      });
      console.log("Posted", transaction.postedTransaction.id);
      console.log("Posted txn", transaction);
      // Example successful id: https://a6gp5qkf2e6mpljgb5ahyk2nobkgtp2zkdqvh2jc6u7j4occw6ha.arweave.net/B4z-wUXRPMetJg9AfCtNcFRpv1lQ4VPpIvU-njhCt44
    } catch (error) {
      console.log("Transaction failed due to:", error.message);
    }
  }
  return (
    <>
      <div className="flex flex-col gap-4 w-1/2">
        <button className="border-4" onClick={logIn}>
          LogIn with Othent
        </button>
        <button className="border-4" onClick={logOut}>
          LogOut with Othent
        </button>
        <input className="border-4" type="file" onChange={handleFileChange} />
        <button className="border-4" onClick={createArweaveTransaction}>
          Create and Post Arweave Transaction
        </button>
        <button className="border-4" onClick={createBundlrTransaction}>
          Create and Post Bundlr Transaction
        </button>
      </div>
    </>
  );
}

export default App;
