const multer = require("multer");

describe("src/clients/aws.s3.client.js", () => {
  beforeEach(() => {
    multer.single = jest.fn();
  });

  afterEach(() => {
    jest.resetModules();
  });

  test("multer configuration initiated succesfully", () => {
    require("../multer.configuration");
  });
});
