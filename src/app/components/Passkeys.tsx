"use client";
import React, { useState } from "react";
import { PasskeyKit, PasskeyServer } from "passkey-kit";
import {
    rpc,
    Networks,
    xdr
} from "@stellar/stellar-sdk";
import * as Client from 'increment';

const NETWORK_PASSPHRASE = Networks.TESTNET;
const RPC_URL = "https://soroban-testnet.stellar.org";
const CONTRACT_ID = "CDAZOG4V2KAPVBBKCAMHUT367AUGYWYEHD652UOJVER5ERNYGFUAC7CE"; // replace with your contract ID

export default function Passkeys() {
    const [contractId, setContractId] = useState("");
    const [keyId, setKeyId] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    const account = new PasskeyKit({
        rpcUrl: "https://soroban-testnet.stellar.org",
        networkPassphrase: Networks.TESTNET,
        walletWasmHash: "ecd990f0b45ca6817149b6175f79b32efb442f35731985a084131e8265c4cd90",
        timeoutInSeconds: 30,
    });

    const pkserver = new PasskeyServer({
        rpcUrl: process.env.PUBLIC_RPC_URL,
        launchtubeUrl: "https://testnet.launchtube.xyz",
        launchtubeJwt: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI5NDM1ODEwZWIxNjhhYTRiZjhlNWMzYTBjYjAzNDg4NzJmMWUzMDBiMmJlZTAxNzgxYzU5MGU3NzU3NGMxM2Y1IiwiZXhwIjoxNzY4NDY1NTYyLCJjcmVkaXRzIjoxMDAwMDAwMDAwLCJpYXQiOjE3NjEyMDc5NjJ9.eRTUVhHDQqxUWa0z2hqNOwn_SROFjhC_1qfmjKVfiqE",
    });

    const contract = new Client.Client({
        rpcUrl: RPC_URL,
        contractId: CONTRACT_ID,
        networkPassphrase: NETWORK_PASSPHRASE,
    })

    const increment = async () => {
        try {
            setLoading(true);
            let at = await contract.increment();
            const { returnValue } = await pkserver.send(at.built!);
            const messageId = xdr.ScVal.fromXDR(returnValue, 'base64').u32();
            setStatus(`Counter value: ${messageId}`);
            setLoading(false);
        } catch (e) {
            setLoading(false);
            console.error("Error invoking increment:", e);
        }
    };

    async function signUp() {
        try {

            const {
                keyIdBase64,
                contractId: cid,
                signedTx,
            } = await account.createWallet("Freighter + Passkeys Demo", "Freighter + Passkeys Demo User");

            await pkserver.send(signedTx);

            setKeyId(keyIdBase64);
            setContractId(cid)
        } catch (e) {
            console.error("Error invoking increment:", e);
        }
    }

    const signIn = async () => {
        try {
            const { keyIdBase64, contractId: cid } = await account.connectWallet();
            setContractId(cid);
            setKeyId(keyIdBase64);
        } catch (error) {
            alert("An error occurred while logging in.");
        }
    };

    async function logout() {
        setContractId('');
        setKeyId('');
    }

    return (
        <div className="max-w-sm rounded overflow-hidden shadow-lg text-center">
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">Sign With Passkeys</div>
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
                {contractId ? (
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
                        <button onClick={signIn} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Sign In
                        </button>
                        <button onClick={signUp} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Create Account
                        </button>
                    </div>
                )}
            </div>
            {contractId ? (
                <span className="text-green-500 font-bold">Connected</span>
            ) : (
                <span className="text-red-500 font-bold">Not Connected</span>
            )}
        </div>
    )
}

