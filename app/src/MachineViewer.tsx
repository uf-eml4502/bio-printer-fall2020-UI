import React, { useState } from "react";
var GrblParser = require("grbl-parser");

var parser = new GrblParser();
const MachineViewer: React.FC = () => {
  const [xPosition, setXPosition] = useState(0);
  const [yPosition, setYPosition] = useState(0);
  const [zPosition, setZPosition] = useState(0);
  const [ePosition, setEPosition] = useState(0);
  const [status, setStatus] = useState(0);

  var updateMachineStatus = function(parsedData: any) {
    // do stuff with parsed data (see example status output in Examples section)
    setStatus(parsedData.data.status.state);
    const { x, y, z, e } = parsedData.data.workPosition;
    setXPosition(x);
    setYPosition(y);
    setZPosition(z);
    setEPosition(e);
  };

  parser.dispatcher.addListener("status", updateMachineStatus); // bind myCallback to grbl status reports

  function sendJog(axis: string, direction: string, speed: number) {
    fetch("http://169.254.2.217/command_silent", {
      headers: {
        "content-type": "application/x-www-form-urlencoded"
      },
      body:
        "G91 G0 " +
        axis +
        (direction === "positive" ? "" : "-") +
        "100 F3000 G90\n",
      method: "POST"
    });
  }

  function pauseJob() {
    fetch("http://169.254.2.217/command_silent", {
      headers: {
        "content-type": "application/x-www-form-urlencoded"
      },
      body: "M25\n",
      method: "POST"
    });
  }

  function eStopJob() {
    fetch("http://169.254.2.217/command_silent", {
      headers: {
        "content-type": "application/x-www-form-urlencoded"
      },
      body: "M26\n",
      method: "POST"
    });
  }

  function setOrigin() {
    fetch("http://169.254.2.217/command_silent", {
      headers: {
        "content-type": "application/x-www-form-urlencoded"
      },
      body: "G92 G92 X0 Y0 Z0 \n",
      method: "POST"
    });
  }

  async function getStatus() {
    const result = await fetch("http://169.254.2.217/query");
    const text = await result.text();
    parser.parseData(text);
  }
  return (
    <React.Fragment>
      <button>In the the component</button>
      <button onClick={getStatus}> Get machine status </button>
      <h1>X:{xPosition}</h1>
      <h1>Y:{yPosition}</h1>
      <h1>Z:{zPosition}</h1>
      <h1>E:{ePosition}</h1>
      <h1>Status:{status}</h1>

      <button>Go Back</button>
      <button onClick={pauseJob}>Pause Job</button>
      <button> Start Job</button>
      <button onClick={eStopJob}>E-Stop</button>
      <br />
      <button onClick={setOrigin}>Set Origin</button>
      <br />
      <button
        onClick={e => {
          sendJog("X", "negative", 300);
        }}
      >
        Jog X-
      </button>
      <button
        onClick={e => {
          sendJog("X", "positive", 300);
        }}
      >
        Jog X+
      </button>
      <br />
      <button
        onClick={e => {
          sendJog("Y", "negative", 300);
        }}
      >
        Jog Y-
      </button>
      <button
        onClick={e => {
          sendJog("Y", "positive", 300);
        }}
      >
        Jog Y+
      </button>
      <br />

      <button
        onClick={e => {
          sendJog("Z", "negative", 300);
        }}
      >
        Jog Z-
      </button>
      <button
        onClick={e => {
          sendJog("Z", "positive", 300);
        }}
      >
        Jog Z+
      </button>
      <br />
    </React.Fragment>
  );
};

export default MachineViewer;
