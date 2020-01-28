import React from "react";
import "./App.css";
import Sphere from "./shape-generators/sphere";

const App: React.FC = () => {
  var sphere = new Sphere();

  console.log(sphere);
  console.log("Runing");
  return (
    <div className="App">
      <header className="App-header">
        <h1> Bio Printer</h1>
      </header>
    </div>
  );
};

export default App;

//Make functions that create sphere coordinates with variable inputs

//Make function that generates extruder velocity based on variable

//Make function that generates G-code based shape array

//
