import React, { useState, useEffect, useRef } from "react";
var GrblParser = require("grbl-parser");
var parser = new GrblParser();
const MachineViewer: React.FC = (props: any) => {
  const [isMachineRunning, setMachineRunning] = useState(false);
  const [xPosition, setXPosition] = useState(0);
  const [yPosition, setYPosition] = useState(0);
  const [zPosition, setZPosition] = useState(0);
  const [ePosition, setEPosition] = useState(0);
  const [status, setStatus] = useState(0);
  const [machine, setMachine] = useState("neo");

  var updateMachineStatus = function(parsedData: any) {
    // do stuff with parsed data (see example status output in Examples section)
    setStatus(parsedData.data.status.state);
    const { x, y, z, e } = parsedData.data.workPosition;
    setXPosition(x);
    setYPosition(y);
    setZPosition(z);
    setEPosition(e);

    if (parsedData.data.status.state === "Idle") {
      //console.log("Machine is Idle")
    }
  };

  useInterval(getStatus, 250);

  function useInterval(callback: any, delay: number) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
      function tick() {
        // @ts-ignore comments
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

  parser.dispatcher.addListener("status", updateMachineStatus); // bind myCallback to grbl status reports

  function sendJog(axis: string, direction: string, speed: number) {
    setMachineRunning(true);
    fetch("http://169.254.2.217/command_silent", {
      headers: {
        "X-Filename": "application/x-www-form-urlencoded"
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

  function onMachineConfigSelect(e: string) {
    console.log(e, "Machine has been selected");
    setMachine(e);
    //Determine machine config
    const config = getMachineConfig();

    //Send the machine config
    sendMachineConfig(config);
  }

  function sendMachineConfig(config: string) {
    //Do some black magic here to send the machine config over the wire and rest the controller
    console.log("Sending machine config");

    const command = "M501 " + config + " \n";
    console.log(command);
    var response = fetch("http://169.254.2.217/command", {
      headers: {
        "content-type": "application/x-www-form-urlencoded"
      },
      body: command,
      method: "POST"
    }).then(res => {
      console.log(res.text());
    });

    console.log(response);

    return response;
  }
  async function sendGCodeToMachine(gcode?: string) {
    //const testgcodeString = "G91 G0 Y100 F3000 G90\n";
    //Upload the Gcode String
    await fetch("http://169.254.2.217/upload", {
      headers: {
        "X-Filename": "bob.gcode"
      },
      method: "POST",
      body: gcode
    });

    //Have the controller Start playing the file
    await fetch("http://169.254.2.217/command", {
      method: "POST",
      body: "play /sd/bob.gcode \n"
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
    if (isMachineRunning) {
      const result = await fetch("http://169.254.2.217/query");
      const text = await result.text();
      parser.parseData(text);
    }
  }

  function getMachineConfig() {
    console.log("Getting machine config");
    console.log(machine);
    switch (machine) {
      case "neo":
        return "neo";

      case "bio":
        return "bio";

      case "pace":
        return "pace";

      case "cancer":
        return "cancer";

      default:
        return "neo";
    }
  }

  function startJob() {
    setMachineRunning(true);
    //Calculate G-code
    const g_code = props.calculateGcode();
    //Send G-Code to Machine
    sendGCodeToMachine(g_code);

    //Update status
  }
  return (
    <div className="outline" augmented-ui="tl-clip br-clip exe">
      <select
        onClick={e => {
          onMachineConfigSelect(e.currentTarget.value);
        }}
      >
        <option value="bio">Bio Sculptor</option>
        <option value="cancer">Cancer Cannon</option>
        <option value="neo">Neo Printer</option>
        <option value="pace">PACE Printer</option>
      </select>
      <h1>X:{xPosition}</h1>
      <h1>Y:{yPosition}</h1>
      <h1>Z:{zPosition}</h1>
      <h1>E:{ePosition}</h1>
      <h1>Status:{status}</h1>

      <button onClick={pauseJob}>Pause Job</button>
      <button onClick={startJob}> Start Job</button>
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
    </div>
  );
};

export default MachineViewer;
