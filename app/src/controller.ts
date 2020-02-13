import {
  Scene,
  MeshPhongMaterial,
  DoubleSide,
  TubeBufferGeometry,
  Mesh
} from "three";

export class bioShapeController {
  shapeList: Array<any>;
  scene: Scene;
  constructor(scene: Scene) {
    this.shapeList = [];
    this.scene = scene;

    //console.log(this.scene);
    //scene.add()
    return this;
  }

  exportGCode() {
    //Generates all the Gcode for the job by looping through shapeList
    //Code to run at top of file
    var g_code = "G21 ;metric values \n";
    g_code += "G90 ;absolute positioning \n";
    g_code += "G92 ;set zero \n";
    g_code += "G83 ;set extruder to relative mode\n";

    for (var i = 0; i < this.shapeList.length; i++) {
      this.shapeList[i].generatePointArray();
      //Run this code between each shape

      g_code += "(Going to next bioshape)";
      g_code += this.shapeList[i].generateGCode();
    }

    console.log(g_code);

    //Trigger file download
  }

  addBioShape(bioShape: any) {
    this.shapeList.push(bioShape);

    const material = new MeshPhongMaterial({
      color: 0x156289,
      emissive: 0x072534,
      side: DoubleSide,
      flatShading: true,
      opacity: 0.2,
      transparent: true
    });
    var path = bioShape.generateThreeCurvePath();
    var geometry1 = new TubeBufferGeometry(
      path,
      path.curves.length,
      0.2,
      8,
      false
    );
    var mesh = new Mesh(geometry1, material);
    this.scene.add(mesh);
  }

  addBioShapes(bioShapes: any) {
    for (const bioShape of bioShapes) {
      const D3data = bioShape.generateThreeCurvePath();
      this.addBioShape(bioShape);
    }
  }

  update() {
    //console.log("updating")
    return null;
  }
}
