//Function: Given radius, and tool diameter generate a sphere shape

import { Shape } from "./shape";

import { Point } from "../react-app-env";
import { LineCurve3, CurvePath, Vector3 } from "three";

export class Sphere extends Shape {
  currentTheta: number; //radian 0 to PI
  currentPhi: number; //radian 0 to 2PI
  layerHeight: number; //mm
  linearStep: number; //mm
  radius: number; //mm
  endPhiPoint: number; //The point to stop storing data in the array

  constructor(
    radius: number,
    layerHeight: number,
    linearStep: number,
    start_height: number = 0,
    end_height: number = 1
  ) {
    super();
    this.currentTheta = 0;
    this.layerHeight = layerHeight;
    this.linearStep = linearStep;
    this.radius = radius;
    this.currentPhi = this.calculatePhiFromZheight(2 * radius * start_height); //Caculated from user startpoint
    this.endPhiPoint = this.calculatePhiFromZheight(2 * radius * end_height); //Calculated for user endpoint
  }

  public generatePointArray(stepSize: number): Point[] {
    //Generate Theta and Phi steps based on stepsize and layer height, and radius
    const totalRevolutions = this.determineTotalRevolutions(
      this.layerHeight,
      this.radius
    );

    while (this.currentPhi < totalRevolutions) {
      //Calculate the current Z height based on current Phi position
      const z = this.calculateZFromPhiRevolutions(this.currentPhi);

      //Add XYZ to points array
      this.pointArray.push({
        x: this.generateXvalue(this.radius, this.currentTheta, this.currentPhi),
        y: this.generateYvalue(this.radius, this.currentTheta, this.currentPhi),
        z: z
      });

      //Determine new Phi value based on linear distance to next
      this.currentPhi = this.currentPhi + 0.1;
      this.currentTheta = this.determineThetaFromZHeight(z);
    }
    return this.pointArray;
  }

  public generateThreeCurvePath(): CurvePath<any> {
    var pointCount = 0;
    var point1 = new Vector3();
    var point2 = new Vector3();

    var curvePath = new CurvePath();

    while (this.currentPhi < this.endPhiPoint) {
      //Calculate the current Z height based on current Phi position
      const x = this.generateXvalue(
        this.radius,
        this.currentTheta,
        this.currentPhi
      );
      const y = this.generateYvalue(
        this.radius,
        this.currentTheta,
        this.currentPhi
      );
      const z = this.calculateZFromPhiRevolutions(this.currentPhi);
      //console.log("x",x,"y",y,"z",z)

      if (pointCount === 0) {
        //This is the first iteration
        //Just calculate and don't store any values
        point1 = new Vector3(x, y, z);
        console.log(point1);
      } else {
        // generate the line, move point 2 to point 1, next.
        point2 = new Vector3(x, y, z);

        const line = new LineCurve3(point1, point2);
        curvePath.add(line);
        // console.log('P1',point1);
        // console.log('P2',point2);
        //console.log('pointCount',pointCount)

        point1 = point2;
      }

      //Determine new Phi value based on linear distance to next
      this.currentPhi = this.currentPhi + 0.01;
      this.currentTheta = this.determineThetaFromZHeight(z);

      pointCount++;
    }

    this.currentPhi = 0;
    this.currentTheta = 0;
    return curvePath;
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

  private calculatePhiFromZheight(z: number) {
    return (z * 2 * Math.PI) / this.layerHeight;
  }

  private determineThetaFromZHeight(z: number) {
    return Math.acos((this.radius - z) / this.radius);
  }
}
