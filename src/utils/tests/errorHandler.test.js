const errorHandler = require("../errorHandler");
const { mockResponse } = require("../../../tests/mock/config.mock");

describe("src/utils/errorHandler.js", () => {
  beforeEach(() => {
    // Mock console.log
    console.log = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("succesfully returns error details in the response", () => {
    const req = {};
    const res = mockResponse();
    const error = new Error("Resource not found");
    error.statusCode = 404;

    errorHandler(error, req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      errorMessage: "Resource not found",
      data: null,
    });
  });

  test("succesfully returns generic error response", () => {
    const req = {};
    const res = mockResponse();
    const error = new Error();

    errorHandler(error, req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      errorMessage: "An error occurred",
      data: null,
    });
  });
});
