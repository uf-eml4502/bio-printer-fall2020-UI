import { Shape } from "./shape";

describe("Generate Theta and Phi Steps", () => {
  var shape = new Shape();

  test("Angular Interval calculations", () => {
    const shapes = new Shape();
    const interval = shapes.calculateAngularInterval(1, 100);

    console.log(interval);

    expect(interval).toBeCloseTo(0.01);
  });
});
