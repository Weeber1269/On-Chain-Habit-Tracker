import "./App.css";
import Header from "./components/Header";
import { useState, createContext } from "react";
import { CreateHabit } from "./components/CreateHabit";
import { CheckinHabit } from "./components/CheckinHabit";
import { AbandonHabit } from "./components/AbandonHabit";
import { ViewHabit } from "./components/ViewHabit";
import { ViewStats } from "./components/ViewStats";

const pubKeyData = createContext();

function App() {
  const [pubKey, _setPubKey] = useState("");

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
