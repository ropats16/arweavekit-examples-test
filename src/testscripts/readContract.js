import { readContractState } from "arweavekit/contract";

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

readContractMainnet();
