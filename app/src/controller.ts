import {
  Scene,
  MeshPhongMaterial,
  DoubleSide,
  TubeGeometry,
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
    var g_code = " BIO PRINTER CODE G28 GXX GXXX initialization";
    for (var i = 0; i < this.shapeList.length; i++) {
      this.shapeList[i].generatePointArray();
      //Run this code between each shape

      g_code += "(Going to next bioshape)";
      g_code += this.shapeList[i].generateGCode();
    }

    console.log(g_code);
  }

  addBioShape(bioShape: any) {
    this.shapeList.push(bioShape);

    const material = new MeshPhongMaterial({
      color: 0x156289,
      emissive: 0x072534,
      side: DoubleSide,
      flatShading: true
    });

    var path = bioShape.generateThreeCurvePath();
    var geometry1 = new TubeGeometry(path, path.curves.length, 0.2, 8, false);
    var mesh = new Mesh(geometry1, material);
    this.scene.add(mesh);
  }

  update() {
    //console.log("updating")
    return null;
  }
}
