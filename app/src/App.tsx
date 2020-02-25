import React from "react";
import "./App.css";
import { ThreeWindow } from "./threeViewer/three";
import MachineViewer from "./MachineViewer";
const App: React.FC = () => {
  //<ThreeWindow />

  return (
    <div className="App">
      <h1> Bio Printer</h1>
      <MachineViewer />
    </div>
  );
};

export default App;

//Make functions that create sphere coordinates with variable inputs

//Make function that generates extruder velocity based on variable

//Make function that generates G-code based shape array

//
