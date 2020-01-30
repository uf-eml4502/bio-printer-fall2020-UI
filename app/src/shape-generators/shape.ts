export class Shape {
  calculateAngularInterval(linearStep: number, radius: number) {
    //Given a linear step size at an arbitary raidus, determine the polar step size needed in radians
    //Assumes that arc length and distance between points is the same
    //The error of this becomes apparent when the linear step is close to the radius
    return linearStep / radius;
  }
}
