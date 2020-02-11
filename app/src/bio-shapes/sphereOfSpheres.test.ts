import { SphereOfSpheres } from "./sphereOfSpheres";

describe("Create  sphere of spheres", () => {
  var spheres = new SphereOfSpheres(50, 2);

  test("Verify that Sphere of Spheres generated data", () => {
    expect(spheres).toBeTruthy();
  });

  test("Export bioshapes", () => {
    spheres.exportBioShapes();
  });
});
