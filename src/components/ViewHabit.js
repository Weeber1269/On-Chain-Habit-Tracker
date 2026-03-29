import React, { useContext, useState } from "react";
import { pubKeyData } from "../App";
import { viewHabit } from "./Soroban";

export const ViewHabit = () => {
  const pubKey = useContext(pubKeyData);
  const [habitId, setHabitId] = useState("");
  const [habitData, setHabitData] = useState(null);

  const habitRows = habitData
    ? [
        ["Habit ID", habitData.habit_id],
        ["Title", habitData.title],
        ["Description", habitData.descrip],
        ["Frequency", habitData.frequency],
        ["Check-ins", habitData.checkins],
        ["Created At", habitData.created_at],
        ["Last Check-in", habitData.last_checkin],
        ["Completed", habitData.is_completed ? "Yes" : "No"],
        ["Abandoned", habitData.is_abandoned ? "Yes" : "No"],
      ]
    : [];

  const handleView = async () => {
    if (!pubKey) return alert("Connect wallet first");

    try {
      const data = await viewHabit(pubKey, habitId);
      setHabitData(data);
    } catch (error) {
      console.error(error);
      alert("Fetch habit failed");
    }
  };

  return (
    <div className="card">
      <div className="title">View Habit</div>
      <input
        type="number"
        className="input"
        placeholder="Habit ID"
        value={habitId}
        onChange={(e) => setHabitId(e.target.value)}
      />
      <button className="btn" onClick={handleView}>
        View
      </button>
      <div className="result-box">
        {habitData ? (
          <div>
            {habitRows.map(([label, value]) => (
              <div
                key={label}
                className="flex justify-between border-b border-blue-100 py-1 text-sm"
              >
                <span className="font-semibold">{label}</span>
                <span>{String(value)}</span>
              </div>
            ))}
          </div>
        ) : (
          "No data"
        )}
      </div>
    </div>
  );
};
