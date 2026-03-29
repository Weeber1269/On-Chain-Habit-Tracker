import React, { useState } from "react";
import "../App.css";

import {
  checkConnection,
  retrievePublicKey,
  getBalance,
  getRequestAccess,
} from "./Freighter";

const Header = ({ pubKey, setPubKey }) => {
  const [connected, setConnected] = useState(false);
  const [balance, setBalance] = useState("0");

  const connectWallet = async () => {
    try {
      await getRequestAccess();
      const allowed = await checkConnection();

      if (!allowed) {
        alert("Permission denied by wallet");
        return;
      }

      const key = await retrievePublicKey();
      const bal = await getBalance();

      setPubKey(key);
      setBalance(Number(bal).toFixed(2));
      setConnected(true);
    } catch (e) {
      console.error(e);
      alert("Wallet connection failed");
    }
  };

  return (
    <div className="header">
      {/* LEFT: TITLE */}
      <div className="header-title">
        On Chain Habit Tracker
      </div>

      {/* RIGHT: WALLET INFO + BUTTON */}
      <div className="header-right">
        {pubKey && (
          <>
            <div className="header-box">
              {`${pubKey.slice(0, 4)}...${pubKey.slice(-4)}`}
            </div>

            <div className="header-box">
              Balance: {balance} XLM
            </div>
          </>
        )}

        <button
          onClick={connectWallet}
          disabled={connected}
          className="header-btn"
          style={{
            opacity: connected ? 0.7 : 1,
            cursor: connected ? "not-allowed" : "pointer"
          }}
        >
          {connected ? "Connected" : "Connect Wallet"}
        </button>
      </div>
    </div>
  );
};

export default Header;