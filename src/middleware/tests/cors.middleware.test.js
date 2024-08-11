const { corsOptions } = require("../cors.middleware");

describe("src/middleware/cors.middleware.js", () => {
  test("corsOptions is defined", () => {
    expect(corsOptions).toBeDefined();
  });
});
