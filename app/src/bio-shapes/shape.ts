export class Shape {
  pointArray: Array<any>;
  extrusion_speed: number;

  constructor() {
    this.pointArray = [];
    this.extrusion_speed = 2;
  }
  calculateAngularInterval(linearStep: number, radius: number) {
    //Given a linear step size at an arbitary raidus, determine the polar step size needed in radians
    //Assumes that arc length and distance between points is the same
    //The error of this becomes apparent when the linear step is close to the radius
    return linearStep / radius;
  }

  generateGCode() {
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
        this.extrusion_speed +
        " \n";
      output_string += new_command;
    }

    //console.log(output_string);

    return output_string;
  }
}
