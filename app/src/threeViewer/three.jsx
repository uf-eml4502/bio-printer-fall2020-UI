import React, { Component } from "react";
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
    this.camera.position.z = 5; // is used here to set some distance from a cube that is located at z = 0
    // OrbitControls allow a camera to orbit around the object
    // https://threejs.org/docs/#examples/controls/OrbitControls
    this.controls = new OrbitControls(this.camera, this.el);
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
    const dog = new Sphere(10, 0.2, 0.1, 0.25, 0.75, 10, 10, 0);
    const cat = new SphereOfSpheres(15, 1);
    const bioShapes = cat.exportBioShapes();

    //this.kontroller.addBioShape(dog);
    this.kontroller.addBioShapes(bioShapes);
    this.kontroller.exportGCode();
  };

  startAnimationLoop = () => {
    //this.cube.rotation.x += 0.01;
    //this.cube.rotation.y += 0.01;
    //this.kontroller.update();
    this.renderer.render(this.scene, this.camera);

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
    return <div ref={ref => (this.el = ref)} />;
  }
}
