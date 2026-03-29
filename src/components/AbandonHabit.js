import React, { useContext, useState } from "react";
import { pubKeyData } from "../App";
import { abandonHabit } from "./Soroban";

export const AbandonHabit = () => {
  const pubKey = useContext(pubKeyData);
  const [habitId, setHabitId] = useState("");
  const [status, setStatus] = useState("");

  const handleAbandon = async () => {
    if (!pubKey) return alert("Connect wallet first");

    try {
      await abandonHabit(pubKey, habitId);
      setStatus("Habit abandoned");
    } catch (error) {
      console.error(error);
      setStatus("Abandon failed");
    }
  };

  return (
    <div className="card">
      <div className="title">Abandon Habit</div>
      <input
        type="number"
        className="input"
        placeholder="Habit ID"
        value={habitId}
        onChange={(e) => setHabitId(e.target.value)}
      />
      <button className="btn" onClick={handleAbandon}>
        Abandon
      </button>
      <div className="result-box">{status || "No action yet"}</div>
    </div>
  );
};
