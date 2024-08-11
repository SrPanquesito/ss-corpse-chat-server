let { validationResult } = require("express-validator");
const { errorsOnValidation } = require("../utils/validationResultChecker");
const {
  dummyRequest,
  mockResponse,
} = require("../../../tests/mock/config.mock");

jest.mock("express-validator");

describe("src/database/mysql.init.js", () => {
  let res, req, next;
  const mockIsEmpty = jest.fn();
  const mockArray = jest.fn();

  beforeEach(() => {
    req = dummyRequest;
    res = mockResponse();
    next = jest.fn();

    validationResult.mockImplementation(() => {
      return {
        isEmpty: mockIsEmpty,
        array: mockArray.mockReturnValue([
          { msg: "Validation failed on field" },
        ]),
      };
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("validation failed - return errors", () => {
    mockIsEmpty.mockReturnValue(false);

    const anyValidationErrors = errorsOnValidation(req, res, next);

    const { statusCode, message } = next.mock.calls[0][0];

    expect(anyValidationErrors).toBe(true);
    expect(next).toHaveBeenCalledTimes(1);
    expect(statusCode).toBe(422);
    expect(message).toContain("Unprocessable content");
  });

  test("validation passed succesfully", () => {
    mockIsEmpty.mockReturnValue(true);

    const anyValidationErrors = errorsOnValidation(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(anyValidationErrors).toBe(false);
  });
});
