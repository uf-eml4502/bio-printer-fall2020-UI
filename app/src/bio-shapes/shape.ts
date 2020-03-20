export class Shape {
  pointArray: Array<any>;

  constructor() {
    this.pointArray = [];
  }
  calculateAngularInterval(linearStep: number, radius: number) {
    //Given a linear step size at an arbitary raidus, determine the polar step size needed in radians
    //Assumes that arc length and distance between points is the same
    //The error of this becomes apparent when the linear step is close to the radius
    return linearStep / radius;
  }

  generateGCode(extrusion_speed: number) {
    var output_string = "";

    for (const point of this.pointArray) {
      const new_command =
        "G01 X" +
        point.x +
        " Y" +
        point.y +
        " Z" +
        point.z +
        " E" +
        extrusion_speed +
        " \n";
      output_string += new_command;
    }

    return output_string;
  }
}
