import "./App.css";
import Header from "./components/Header";
import { useState, createContext, useEffect, useRef } from "react";
import confetti from "canvas-confetti";

import { CreateHabit } from "./components/CreateHabit";
import { CheckinHabit } from "./components/CheckinHabit";
import { AbandonHabit } from "./components/AbandonHabit";
import { ViewHabit } from "./components/ViewHabit";
import { ViewStats } from "./components/ViewStats";

const pubKeyData = createContext();

function App() {
  const [pubKey, _setPubKey] = useState("");
    const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio("/music.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;

    const startMusic = () => {
      audioRef.current.play().catch(() => {});
      window.removeEventListener("click", startMusic);
    };

    window.addEventListener("click", startMusic);

    return () => {
      audioRef.current.pause();
    };
  }, []);
  // 🎉 Confetti on load
  useEffect(() => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#7c3aed", "#3b82f6", "#22d3ee"]
    });

    const duration = 2000;
    const end = Date.now() + duration;

    const interval = setInterval(() => {
      if (Date.now() > end) return clearInterval(interval);

      confetti({
        particleCount: 30,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#7c3aed", "#22d3ee"]
      });

      confetti({
        particleCount: 30,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#3b82f6", "#22d3ee"]
      });

    }, 250);
  }, []);

  return (
    <div className="App">
      <Header pubKey={pubKey} setPubKey={_setPubKey} />
      <pubKeyData.Provider value={pubKey}>
        <div className="main-container">
          <div className="grid-layout">
            <CreateHabit />
            <CheckinHabit />
            <AbandonHabit />
            <ViewHabit />
            <ViewStats />
          </div>
        </div>
      </pubKeyData.Provider>
    </div>
  );
}

export default App;
export { pubKeyData };