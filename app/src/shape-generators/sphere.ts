//Function: Given radius, and tool diameter generate a sphere shape

import { Shape } from "./shape";

import { Point } from "../react-app-env";

export default class Sphere extends Shape {
  currentTheta: number; //radian 0 to PI
  currentPhi: number; //radian 0 to 2PI
  layerHeight: number; //mm
  linearStep: number; //mm
  radius: number; //mm
  pointArray: Point[];

  constructor() {
    super();
    this.currentTheta = 1;
    this.currentPhi = 1;
    this.layerHeight = 1;
    this.linearStep = 1;
    this.radius = 1;
    this.pointArray = this.generatePointArray(this.radius, 1);
  }

  private generatePointArray(radius: number, stepSize: number): Point[] {
    var pointArray = [];

    //Generate Theta and Phi steps based on stepsize and layer height, and radius

    pointArray.push({
      x: this.generateXvalue(this.radius, this.currentTheta, this.currentPhi),
      y: this.generateYvalue(this.radius, this.currentTheta, this.currentPhi),
      z: this.generateZvalue(this.radius, this.currentTheta, this.currentPhi)
    });

    return pointArray;
  }

  private generateXvalue(radius: number, theta: number, phi: number): number {
    return radius * Math.sin(theta) * Math.cos(theta);
  }

  private generateYvalue(radius: number, theta: number, phi: number): number {
    return radius * Math.sin(theta) * Math.sin(theta);
  }

  private generateZvalue(radius: number, theta: number, phi: number): number {
    return radius * Math.cos(theta);
  }
}
