import { Sphere } from "./sphere";

export class SphereOfSpheres {
  exteriorSphereDiameter: number; //mm
  interiorSphereDiameter: number; //mm
  bioShapesStack: Array<any>;
  gridPoints: Array<any>;

  constructor(exteriorSphereDiameter: number, interiorSphereDiameter: number) {
    this.bioShapesStack = [];
    this.exteriorSphereDiameter = exteriorSphereDiameter; //mm
    this.interiorSphereDiameter = interiorSphereDiameter; //mm
    this.gridPoints = this.generateInteriorSphereParameters();

    return this.exportBioShapes();
  }

  generateInteriorSphereParameters() {
    //Create all of the X,Y,Z center points and radius parameters of interior sphere

    //determine  size of inscribed sphere
    const inscribed_square_length = this.exteriorSphereDiameter / 1.9;
    var gridPoints = [];
    const step_size = this.interiorSphereDiameter + 0.2; //The point .2 is a hack to compensate for the filament diameter

    const circles_on_axis = Math.floor(
      inscribed_square_length / this.interiorSphereDiameter
    );
    var x =
      this.interiorSphereDiameter / 2 -
      (circles_on_axis / 2) * step_size +
      0.5 * step_size;
    var y =
      this.interiorSphereDiameter / 2 -
      (circles_on_axis / 2) * step_size +
      0.5 * step_size;
    var z =
      this.interiorSphereDiameter / 2 +
      this.exteriorSphereDiameter / 2 -
      this.interiorSphereDiameter / 2 -
      (circles_on_axis / 2) * step_size;
    const x_start = x;
    const y_start = y;
    console.log("Circles on edge", circles_on_axis);

    //Loop through all the Z layers

    for (let i = 0; i < circles_on_axis; i++) {
      for (let j = 0; j < circles_on_axis; j++) {
        for (let k = 0; k < circles_on_axis; k++) {
          gridPoints.push({
            x: x - this.interiorSphereDiameter / 2,
            y: y - this.interiorSphereDiameter / 2,
            z: z
          });
          y += step_size;
        }
        x += step_size;
        y = y_start;
      }
      x = x_start;
      z += step_size;
    }

    return gridPoints;
  }

  generateBottomExteriorSphere() {
    //Create the bottom half of the exterior sphere
  }

  generateTopExteriorSphere() {
    //Create the top half of the exterior sphere
  }

  exportBioShapes(): any {
    //Exports an array of BioShapes, this will be used for bio printer controller
    var result = [];
    result.push(new Sphere(this.exteriorSphereDiameter / 2, 0.2, 1, 0, 0.5));
    for (const gridPoint of this.gridPoints) {
      const sphere = new Sphere(
        this.interiorSphereDiameter / 2,
        0.1,
        1,
        0,
        1,
        gridPoint.x,
        gridPoint.y,
        gridPoint.z
      );
      result.push(sphere);
    }
    result.push(new Sphere(this.exteriorSphereDiameter / 2, 0.2, 1, 0.5, 1));

    return result;
  }
}
