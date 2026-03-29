import React, { useContext, useState } from "react";
import { pubKeyData } from "../App";
import { checkinHabit } from "./Soroban";

export const CheckinHabit = () => {
  const pubKey = useContext(pubKeyData);
  const [habitId, setHabitId] = useState("");
  const [status, setStatus] = useState("");

  const handleCheckin = async () => {
    if (!pubKey) return alert("Connect wallet first");

    try {
      await checkinHabit(pubKey, habitId);
      setStatus("Check-in successful");
    } catch (error) {
      console.error(error);
      setStatus("Check-in failed");
    }
  };

  return (
    <div className="card">
      <div className="title">Check-In Habit</div>
      <input
        type="number"
        className="input"
        placeholder="Habit ID"
        value={habitId}
        onChange={(e) => setHabitId(e.target.value)}
      />
      <button className="btn" onClick={handleCheckin}>
        Check In
      </button>
      <div className="result-box">{status || "No check-in yet"}</div>
    </div>
  );
};
