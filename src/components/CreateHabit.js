import React, { useContext, useState } from "react";
import { pubKeyData } from "../App";
import { createHabit } from "./Soroban";

export const CreateHabit = () => {
  const pubKey = useContext(pubKeyData);
  const [title, setTitle] = useState("");
  const [descrip, setDescrip] = useState("");
  const [frequency, setFrequency] = useState("");
  const [habitId, setHabitId] = useState("");

  const handleCreateHabit = async () => {
    if (!pubKey) return alert("Connect wallet first");

    try {
      const id = await createHabit(pubKey, title, descrip, frequency);
      setHabitId(String(id));
    } catch (error) {
      console.error(error);
      alert("Failed to create habit");
    }
  };

  return (
    <div className="card">
      <div className="title">Create Habit</div>
      <input
        type="text"
        className="input"
        placeholder="Habit title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="textarea"
        placeholder="Habit description"
        value={descrip}
        onChange={(e) => setDescrip(e.target.value)}
      />
      <input
        type="number"
        className="input"
        placeholder="Target frequency"
        value={frequency}
        onChange={(e) => setFrequency(e.target.value)}
      />
      <button className="btn" onClick={handleCreateHabit}>
        Create
      </button>
      <div className="result-box">Habit ID: {habitId || "-"}</div>
    </div>
  );
};
