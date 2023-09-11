import { Othent } from "arweavekit/auth";
import { useState } from "react";
import {
  createTransaction,
  signTransaction,
  postTransaction,
} from "arweavekit/transaction";
import { queryAllTransactionsGQL } from "arweavekit/graphql";
import {
  createContract,
  writeContract,
  readContractState,
} from "arweavekit/contract";
import {
  encryptDataWithAES,
  decryptDataWithAES,
  encryptAESKeywithRSA,
  decryptAESKeywithRSA,
} from "arweavekit/encryption";
import Spinner from "./components/Spinner";

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
  const [isLoading, setIsLoading] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState(0);

  function handleFileChange(e) {
    setFiles(e.target.files);
  }

  async function createArweaveTransaction() {
    try {
      console.log(files[0]);
      const data = await toArrayBuffer(files[0]);
      console.log(data);
      let creator = "Anon";
      try {
        creator = await window.arweaveWallet.getActiveAddress();
      } catch (e) {
        //
      }
      const metaData = [
        { name: "Creator", value: creator },
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
      let creator = "Anon";
      try {
        creator = await window.arweaveWallet.getActiveAddress();
      } catch (e) {
        //
      }
      const metaData = [
        { name: "Creator", value: creator },
        { name: "Title", value: "Bundlr PNG" },
        { name: "Content-Type", value: "image/png" },
      ];
      const transaction = await createTransaction({
        data: window.Buffer.from(data),
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

  async function queryGQLTxn() {
    const query = `
query {
  transactions(
    tags: [
      {
        name: "Contract-Src"
        values: ["DG22I8pR_5_7EJGvj5FbZIeEOgfm2o26xwAW5y4Dd14"]
      }
    ]
    first: 100
  ) {
    edges {
      node {
        id
        owner {
          address
        }
        tags {
          name
          value
        }
        block {
          timestamp
        }
      }
    }
  }
}
`;

    const res = await queryAllTransactionsGQL(query, {
      gateway: "arweave.net",
      filters: {},
    });

    console.log("This is the result of the query", res);
  }

  async function createContractTestNet() {
    const { contract, result } = await createContract({
      environment: "testnet",
      initialState: JSON.stringify({ counter: 0 }),
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

  async function writeContractTestNet() {
    const response = await writeContract({
      environment: "testnet",
      contractTxId: "CO7NkmEVj4wEwPySxYUY0_ElrEqU4IeTglU2IilCnLA",
      options: {
        function: "increment",
      },
    });

    console.log(response);
  }

  async function readContractMainnet() {
    const { readContract } = await readContractState({
      environment: "mainnet",
      contractTxId: "61vg8n54MGSC9ZHfSVAtQp4WjNb20TaThu6bkQ86pPI",
      evaluationOptions: {
        remoteStateSyncEnabled: true,
        internalWrites: true,
        allowBigInt: true,
      },
    });
    console.log(readContract);
  }

  async function encryptDecryptData() {
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
      "Encrypted and Decrypted successfully?: ",
      arraybufferEqual(dataToEncrypt, decryptedData)
    );
  }

  async function encryptDecryptKey() {
    const keyToEncrypt = "ArweaveKit";

    const encryptedKey = await encryptAESKeywithRSA({
      key: keyToEncrypt,
    });

    const decryptedKey = await decryptAESKeywithRSA({
      key: encryptedKey,
    });

    console.log({
      encryptedKey,
      keyToEncrypt,
      decryptedKey,
    });
  }

  async function functionWrapper(callback, index) {
    setLoadingIndex(index);
    setIsLoading(true);
    try {
      await callback();
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  }

  const inputElements = [
    {
      name: "LogIn with Othent",
      onClick: logIn,
    },
    {
      name: "LogOut with Othent",
      onClick: logOut,
    },
    {
      name: "",
      onChange: handleFileChange,
    },
    {
      name: "Create and Post Arweave Transaction",
      onClick: createArweaveTransaction,
    },
    {
      name: "Create and Post Bundlr Transaction",
      onClick: createBundlrTransaction,
    },
    {
      name: "Query All GQL Transactions",
      onClick: queryGQLTxn,
    },
    {
      name: "Create Contract Testnet",
      onClick: createContractTestNet,
    },
    {
      name: "Write Contract Testnet",
      onClick: writeContractTestNet,
    },
    { name: "Read Contract mainnet", onClick: readContractMainnet },
    {
      name: "Encrypt & Decrypt Data",
      onClick: encryptDecryptData,
    },
    {
      name: "Encrypt & Decrypt Key",
      onClick: encryptDecryptKey,
    },
  ];

  return (
    <div className="container mx-auto flex justify-center h-screen pt-12 px-2">
      <div className="flex flex-col gap-4 w-1/2 max-md:w-full">
        {inputElements.map(({ name, onChange, onClick }, index) =>
          onChange ? (
            <input
              key={index}
              className="border-4 flex justify-center items-center p-1 cursor-pointer hover:bg-blue-200"
              type="file"
              onChange={onChange}
            />
          ) : (
            <button
              key={index}
              className="border-4 flex justify-center items-center p-1 hover:bg-blue-200"
              onClick={() => functionWrapper(onClick, index)}
            >
              {isLoading && loadingIndex === index && <Spinner />}
              {name}
            </button>
          )
        )}
      </div>
    </div>
  );
}

export default App;
