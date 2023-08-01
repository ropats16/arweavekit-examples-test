import { Othent } from "arweavekit/auth";
// import { signTransaction } from "arweavekit/transaction";
import { useState } from "react";

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
    const data = await toArrayBuffer(files[0]);
    console.log(data);
    // const transaction = await createTransaction({
    //   data: data,
    //   type: "data",
    //   environment: "mainnet",
    // });
  }
  return (
    <div className="flex flex-col gap-4">
      <button onClick={logIn}>LogIn with Othent</button>
      <button onClick={logOut}>LogOut with Othent</button>
      <input type="file" onChange={handleFileChange} />
      <button onClick={createArweaveTransaction}>
        Create Arweave Transaction
      </button>
    </div>
  );
}

export default App;
