//Function: Given radius, and tool diameter generate a sphere shape

import { Shape } from "./shape";

import { Point } from "../react-app-env";

export default class Sphere extends Shape {
  currentTheta: number; //radian 0 to PI
  currentPhi: number; //radian 0 to 2PI
  layerHeight: number; //mm
  linearStep: number; //mm
  radius: number; //mm

  constructor(radius: number, layerHeight: number, linearStep: number) {
    super();
    this.currentTheta = 1;
    this.currentPhi = 1;
    this.layerHeight = layerHeight;
    this.linearStep = linearStep;
    this.radius = radius;
  }

  public generatePointArray(stepSize: number): Point[] {
    var pointArray = [];

    //Generate Theta and Phi steps based on stepsize and layer height, and radius
    const totalRevolutions = this.determineTotalRevolutions(
      this.layerHeight,
      this.radius
    );
    console.log("Total Revolutions", totalRevolutions);

    while (this.currentPhi < totalRevolutions) {
      //Calculate the current Z height based on current Phi position
      const z = this.calculateZFromPhiRevolutions(this.currentPhi);

      //Add XYZ to points array
      pointArray.push({
        x: this.generateXvalue(this.radius, this.currentTheta, this.currentPhi),
        y: this.generateYvalue(this.radius, this.currentTheta, this.currentPhi),
        z: z
      });

      //Determine new Phi value based on linear distance to next
      this.currentPhi = this.currentPhi + 0.1;
      this.currentTheta = this.determineThetaFromZHeight(z);
    }
    return pointArray;
  }

  private generateXvalue(radius: number, theta: number, phi: number): number {
    return radius * Math.sin(theta) * Math.cos(phi);
  }

  private generateYvalue(radius: number, theta: number, phi: number): number {
    return radius * Math.sin(theta) * Math.sin(phi);
  }

  private determineTotalRevolutions(layerHeight: number, sphereRadius: number) {
    //Input Radius of sphere and layer Height
    //Output: total revolutions needed in radians
    const totalRevolutions = (2 * sphereRadius) / layerHeight; //From bottom to top of sphere
    const totalRadians = totalRevolutions * 2 * Math.PI;
    return totalRadians;
  }

  private calculateZFromPhiRevolutions(phi: number) {
    //Determine height from ground based on phi
    const height = this.layerHeight * (phi / (2 * Math.PI));
    //Determine phi from Z height

    return height;
  }

  private determineThetaFromZHeight(z: number) {
    return Math.acos((this.radius - z) / this.radius);
  }
}
