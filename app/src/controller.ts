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
  syringeDiameter: number; //mm
  constructor(scene: Scene) {
    this.shapeList = [];
    this.scene = scene;
    this.syringeDiameter = 10;

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

    const extruder_speed = this.calculateExtruderSpeed();
    for (var i = 0; i < this.shapeList.length; i++) {
      this.shapeList[i].generatePointArray();
      //Run this code between each shape

      g_code += "(Going to next bioshape)";
      //Should pass in an extrude value here to compensate for syringe black magic

      g_code += this.shapeList[i].generateGCode(extruder_speed);
    }
    return g_code;
    //Trigger file download
  }

  clearScene() {
    console.log(this.scene);
    for (var i = 0; i < this.scene.children.length; i++) {
      //Clears the scene of old meshs
      if (this.scene.children[i].type === "Mesh") {
        //@ts-ignore
        this.scene.children[i].material.dispose();
        //@ts-ignore
        this.scene.children[i].geometry.dispose();
        this.scene.remove(this.scene.children[i]);
      }
    }
  }

  addBioShape(bioShape: any, clearScene?: boolean) {
    //Remove any old shapes from prior and clear the scene
    if (clearScene) {
      this.clearScene();
    }
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
      this.addBioShape(bioShape, false);
    }
  }

  updateSyringeDiameter(diameter: string) {
    if (parseFloat(diameter)) {
      this.syringeDiameter = parseFloat(diameter);
      console.log("Synringe Diameter updated to ", parseFloat(diameter));
    }
  }

  calculateExtruderSpeed() {
    //PUt some bulsshit here for now
    return this.syringeDiameter / 2;
  }
}
