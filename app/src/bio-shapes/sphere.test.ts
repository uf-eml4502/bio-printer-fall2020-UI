import { Sphere } from "./sphere";
import { Shape } from "./shape";

describe("Create spheres", () => {
  const layer_height = 0.2; //mm
  const radius = 10; //mm
  const linearStep = 0.1; //mm

  var sphere = new Sphere(radius, layer_height, linearStep);
  test("Determine total rotations in radians", () => {
    expect(sphere).toBeTruthy();

    // @ts-ignore
    var rotations = sphere.determineTotalRevolutions(layer_height, radius); //Radians
    expect(rotations).toBeTruthy();
  });

  test("Determine Z from Phi revolutions", () => {
    // @ts-ignore
    var currentHeight = sphere.calculateZFromPhiRevolutions(4 * Math.PI);
    expect(currentHeight).toEqual(0.4);
  });

  test("Determine theta from Z Height", () => {
    // @ts-ignore
    var theta = sphere.determineThetaFromZHeight(10);
    expect(theta).toBeCloseTo(1.5707);
  });

  test("Generate Point Array", () => {
    const pointArray = sphere.generatePointArray(0.1);
    console.log(pointArray);

    expect(pointArray).toBeTruthy();
  });
});
