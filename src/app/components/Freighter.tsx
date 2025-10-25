"use client";
import React, { useState } from "react";
import {
  Contract,
  rpc,
  TransactionBuilder,
  Networks,
  BASE_FEE,
} from "@stellar/stellar-sdk";
import {
  signTransaction,
  requestAccess,
} from "@stellar/freighter-api";

const NETWORK_PASSPHRASE = Networks.TESTNET;
const RPC_URL = "https://soroban-testnet.stellar.org";
const CONTRACT_ID = "CDAZOG4V2KAPVBBKCAMHUT367AUGYWYEHD652UOJVER5ERNYGFUAC7CE"; // replace with your contract ID

export default function Freighter() {
  const [address, setAddress] = useState<string | any>("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const retrievePublicKey = async () => {
    const accessObj = await requestAccess();

    if (accessObj.error) {
      console.log("Error retrieving public key:", accessObj.error);
      return accessObj.error;
    } else {
      console.log("Retrieved public key:", accessObj.address);
      setAddress(accessObj.address);
      return accessObj.address;
    }
  };

  const increment = async () => {
    if (!address) {
      setStatus("Please connect Freighter first.");
      return;
    }

    try {
      setLoading(true);
      const server = new rpc.Server(RPC_URL, { allowHttp: true });
      const account = await server.getAccount(address);
      const contract = new Contract(CONTRACT_ID);

      let tx = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: NETWORK_PASSPHRASE,
      })
      .addOperation(contract.call("increment"))
      .setTimeout(30)
      .build();

      // Prepare transaction (adds footprint etc.)
      tx = await server.prepareTransaction(tx);

      // Sign with Freighter
      const signedXdr = await signTransaction(tx.toXDR(), {
        networkPassphrase: NETWORK_PASSPHRASE,
      });

      const signedTx = TransactionBuilder.fromXDR(
        signedXdr.signedTxXdr,
        NETWORK_PASSPHRASE
      );

      // Send
      const sendResp = await server.sendTransaction(signedTx);

      // Poll for completion
      let txResponse = await server.getTransaction(sendResp.hash);

      while (txResponse.status === "NOT_FOUND") {
        await new Promise((r) => setTimeout(r, 2000));
        txResponse = await server.getTransaction(sendResp.hash);
      }

      setStatus("Counter value: " + txResponse.returnValue._value);
      setLoading(false);

    } catch (err: any) {
      console.error(err);
      setLoading(false);
      setStatus("Error: " + err.message);
    }
  };

  const logout = async () => {
    setAddress("");
  }

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg text-center">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">Sign With Freighter</div>
        <p className="text-gray-700 text-base">
          {status}
        </p>
        {loading && (
          <div role="status" className="flex justify-center mt-4">
            <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        )}
      </div>
      <div className="px-6 py-4 pb-8">
        {address ? (
          <div className="flex gap-2.5 justify-center">
            <button onClick={increment} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Invoke & Sign
            </button>
            <button onClick={logout} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Sign Out
            </button>
          </div>
        ) : (
          <div className="flex gap-2.5 justify-center">
            <button onClick={retrievePublicKey} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
              Connect Freighter
            </button>
          </div>
        )}
      </div>
      {address ? (
        <span className="text-green-500 font-bold">Connected</span>
      ) : (
        <span className="text-red-500 font-bold">Not Connected</span>
      )}
    </div>
  )
}


