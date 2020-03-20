import React, { Component, useState } from "react";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  PointLight,
  GridHelper,
  AxesHelper
} from "three";
import { Sphere } from "../bio-shapes/sphere";
import { SphereOfSpheres } from "../bio-shapes/sphereOfSpheres";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { bioShapeController } from "../controller";
import MachineViewer from "../MachineViewer";

export class ThreeWindow extends Component {
  componentDidMount() {
    this.sceneSetup();
    this.addCustomSceneObjects();
    this.startAnimationLoop();
    window.addEventListener("resize", this.handleWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowResize);
    window.cancelAnimationFrame(this.requestID);
    this.controls.dispose();
  }

  sceneSetup = () => {
    // get container dimensions and use them for scene sizing

    this.scene = new Scene();
    this.kontroller = new bioShapeController(this.scene);

    //kontroller.exportGcode();
    this.camera = new PerspectiveCamera(
      75, // fov = field of view
      window.innerWidth / window.innerHeight, // aspect ratio
      0.1, // near plane
      1000 // far plane
    );
    this.camera.position.set(10, 10, 20); // is used here to set some distance from a cube that is located at z = 0
    this.camera.up.set(0, 0, 1);
    // OrbitControls allow a camera to orbit around the object
    // https://threejs.org/docs/#examples/controls/OrbitControls
    this.controls = new OrbitControls(this.camera, this.el);
    this.controls.autoRotate = true;
    this.renderer = new WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.el.appendChild(this.renderer.domElement); // mount using React ref

    const lights = [];
    lights[0] = new PointLight(0xffffff, 1, 0);
    lights[1] = new PointLight(0xffffff, 1, 0);
    lights[2] = new PointLight(0xffffff, 1, 0);

    lights[0].position.set(0, 200, 0);
    lights[1].position.set(100, 200, 100);
    lights[2].position.set(-100, -200, -100);

    this.scene.add(new GridHelper(10, 10).rotateX(Math.PI / 2));
    this.scene.add(new AxesHelper(200));

    this.scene.add(lights[0]);
    this.scene.add(lights[1]);
    this.scene.add(lights[2]);
  };

  addCustomSceneObjects = () => {
    this.kontroller.addBioShape(new Sphere(10 / 2, 0.2, 0.1, 0, 1, 0, 0, 0));
    //this.kontroller.addBioShapes(bioShapes);
    //this.kontroller.exportGCode();
  };

  startAnimationLoop = () => {
    //this.cube.rotation.x += 0.01;
    //this.cube.rotation.y += 0.01;
    //this.kontroller.update();
    this.renderer.render(this.scene, this.camera);

    this.controls.update();
    // The window.requestAnimationFrame() method tells the browser that you wish to perform
    // an animation and requests that the browser call a specified function
    // to update an animation before the next repaint
    this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
  };

  handleWindowResize = () => {
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;

    // Note that after making changes to most of camera properties you have to call
    // .updateProjectionMatrix for the changes to take effect.
    this.camera.updateProjectionMatrix();
  };

  render() {
    return (
      <React.Fragment>
        <div className="Three-view" ref={ref => (this.el = ref)} />
        <div className="container">
          <div className="overlay-left">
            <BioShapeCreatorMenu
              onAddShape={bioShape => this.kontroller.addBioShape(bioShape)}
              onAddShapes={bioShapes => this.kontroller.addBioShapes(bioShapes)}
            />
          </div>
          <div className="example-one title" data-text="3D Bio Printer">
            3D Bio Printer
          </div>

          <div className="overlay-right">
            <SyringeParameters
              updateSyringeDiameter={diameter => {
                this.kontroller.updateSyringeDiameter(diameter);
              }}
            />
            <MachineViewer
              calculateGcode={() => {
                return this.kontroller.exportGCode();
              }}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function BioShapeCreatorMenu(props) {
  const [shape, setShape] = useState("Simple Sphere");

  //This is for simple Sphere
  const [diameter, setDiameter] = useState(10);
  const [featureSize, setFeatureSize] = useState(0.2);

  //This is for sphere of spheres
  const [exteriorDiameter, setExteriorDiameter] = useState(15);
  const [interiorDiameter, setInteriorDiameter] = useState(2);

  function showShapeOptions() {
    switch (shape) {
      case "Simple Sphere":
        console.log("HIT");

        return (
          <React.Fragment>
            <label htmlFor="diameter">Diameter (in um)</label>
            <input
              onChange={e => {
                setDiameter(parseFloat(e.target.value));
              }}
              value={diameter}
              id="diameter"
            />
            <br />
            <label htmlFor="featureSize">Feature Size (in um)</label>
            <input
              onChange={e => {
                setFeatureSize(parseFloat(e.target.value));
              }}
              value={featureSize}
              id="featureSize"
            />
            <br />
            <button
              onClick={() => {
                props.onAddShape(
                  new Sphere(diameter / 2, featureSize, 0.1, 0, 1, 0, 0, 0)
                );
              }}
            >
              {" "}
              Generate
            </button>
          </React.Fragment>
        );

      case "Sphere of Spheres":
        return (
          <React.Fragment>
            <label htmlFor="Exterior diameter">Exterior Diameter (in um)</label>
            <input
              onChange={e => {
                setExteriorDiameter(parseFloat(e.target.value));
              }}
              value={exteriorDiameter}
              id="Exterior diameter"
            />
            <br />
            <label htmlFor="InteriorDiameter">Interior Diameter (in um)</label>
            <input
              onChange={e => {
                setInteriorDiameter(parseFloat(e.target.value));
              }}
              value={interiorDiameter}
              id="featureSize"
            />
            <br />
            <button
              onClick={() => {
                props.onAddShapes(
                  new SphereOfSpheres(exteriorDiameter, interiorDiameter)
                );
              }}
            >
              {" "}
              Generate
            </button>
          </React.Fragment>
        );

      default:
        return null;
    }
  }

  return (
    <div className="outline" augmented-ui="tl-clip br-clip exe">
      <h1>Shape Generator</h1>
      <select
        onClick={e => {
          setShape(e.target.value);
        }}
      >
        <option>Simple Sphere</option>
        <option>Sphere of Spheres</option>
      </select>
      <br />
      {showShapeOptions()}
    </div>
  );
}

function SyringeParameters(props) {
  return (
    <div className="outline" augmented-ui="tl-clip br-clip exe">
      <h1>Syringe</h1>
      <label>Syringe Diameter (mm)</label>
      <input
        defaultValue="10"
        onChange={e => {
          props.updateSyringeDiameter(e.target.value);
        }}
      />
    </div>
  );
}
