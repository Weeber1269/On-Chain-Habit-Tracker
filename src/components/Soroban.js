import {
  Contract,
  TransactionBuilder,
  Networks,
  BASE_FEE,
  nativeToScVal,
  scValToNative,
  rpc as StellarRpc,
} from "@stellar/stellar-sdk";

import { userSignTransaction } from "./Freighter";

const RPC_URL = "https://soroban-testnet.stellar.org:443";
const NETWORK = Networks.TESTNET;
const CONTRACT_ADDRESS = "CANTK2B3XVOOUEU4YRWYFMOHSQGAAINHDVCAQEM7RPQD4HMZCL2MZQ4A";

const server = new StellarRpc.Server(RPC_URL);

const TX_PARAMS = {
  fee: BASE_FEE,
  networkPassphrase: NETWORK,
};

const numberToU64 = (value) => nativeToScVal(Number(value), { type: "u64" });

async function contractInt(caller, fnName, values) {
  const sourceAccount = await server.getAccount(caller);
  const contract = new Contract(CONTRACT_ADDRESS);
  const builder = new TransactionBuilder(sourceAccount, TX_PARAMS);

  if (Array.isArray(values)) {
    builder.addOperation(contract.call(fnName, ...values));
  } else if (values !== undefined && values !== null) {
    builder.addOperation(contract.call(fnName, values));
  } else {
    builder.addOperation(contract.call(fnName));
  }

  const tx = builder.setTimeout(30).build();
  const preparedTx = await server.prepareTransaction(tx);
  const xdr = preparedTx.toXDR();

  const signed = await userSignTransaction(xdr, caller);
  const signedTx = TransactionBuilder.fromXDR(signed.signedTxXdr, NETWORK);

  const send = await server.sendTransaction(signedTx);

  for (let i = 0; i < 15; i += 1) {
    const res = await server.getTransaction(send.hash);

    if (res.status === "SUCCESS") {
      if (res.returnValue) {
        return scValToNative(res.returnValue);
      }
      return null;
    }

    if (res.status === "FAILED") {
      throw new Error("Transaction failed");
    }

    await new Promise((r) => setTimeout(r, 1000));
  }

  throw new Error("Transaction timeout");
}

async function createHabit(caller, title, descrip, frequency) {
  const args = [nativeToScVal(title), nativeToScVal(descrip), numberToU64(frequency)];
  const result = await contractInt(caller, "create_habit", args);
  return Number(result);
}

async function checkinHabit(caller, habitId) {
  await contractInt(caller, "checkin_habit", [numberToU64(habitId)]);
  return true;
}

async function abandonHabit(caller, habitId) {
  await contractInt(caller, "abandon_habit", [numberToU64(habitId)]);
  return true;
}

async function viewHabit(caller, habitId) {
  return await contractInt(caller, "view_habit", [numberToU64(habitId)]);
}

async function viewAllStats(caller) {
  return await contractInt(caller, "view_all_stats");
}

export {
  createHabit,
  checkinHabit,
  abandonHabit,
  viewHabit,
  viewAllStats,
};
