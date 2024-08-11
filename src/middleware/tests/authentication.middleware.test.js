const jwt = require("jsonwebtoken");
const { isAuthenticated } = require("#middleware/authentication.middleware");
const { mockResponse, dummyUser } = require("../../../tests/mock/config.mock");

describe("src/middleware/authentication.middleware.js", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      userId: null,
      get: jest.fn().mockReturnValue(`Bearer ${dummyUser.token}`),
    };
    res = mockResponse();
    next = jest.fn();
    jwt.verify = jest.fn().mockReturnValue({ userId: dummyUser.id });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("isAuthenticated sets user id via token retrieval succesfully", () => {
    isAuthenticated(req, res, next);

    expect(req.userId).toBe(dummyUser.id);
    expect(next).toHaveBeenCalledTimes(1);
    expect(jwt.verify).toHaveBeenCalledTimes(1);
  });

  test("error req.get fails trying to retrieve token", () => {
    req.get = jest.fn().mockReturnValue(null);

    expect(() => {
      isAuthenticated(req, res, next);
    }).toThrow(
      expect.objectContaining({
        statusCode: 401,
        message: "Not authenticated.",
      }),
    );

    expect(req.userId).toBe(null);
    expect(jwt.verify).not.toHaveBeenCalled();
  });

  test("error jwt throws error trying to verify secret", () => {
    jwt.verify = jest.fn().mockImplementation(() => {
      throw new Error("Invalid token.");
    });

    expect(() => {
      isAuthenticated(req, res, next);
    }).toThrow(
      expect.objectContaining({
        statusCode: 500,
        message: "Invalid token.",
      }),
    );

    expect(req.userId).toBe(null);
    expect(next).not.toHaveBeenCalled();
  });

  test("error jwt returns null token on verification", () => {
    jwt.verify = jest.fn().mockReturnValue(null);

    expect(() => {
      isAuthenticated(req, res, next);
    }).toThrow(
      expect.objectContaining({
        statusCode: 401,
        message: "Not authenticated.",
      }),
    );

    expect(req.userId).toBe(null);
    expect(next).not.toHaveBeenCalled();
  });
});
