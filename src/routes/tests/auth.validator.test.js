const { body } = require("express-validator");

jest.mock("express-validator");
jest.mock("#models/users.model", () => ({
  findOne: jest.fn(),
}));

describe("src/routes/validators/auth.validator.js", () => {
  const mockBody = {
    trim: jest.fn().mockReturnThis(),
    isEmail: jest.fn().mockReturnThis(),
    withMessage: jest.fn().mockReturnThis(),
    custom: jest.fn().mockReturnThis(),
    normalizeEmail: jest.fn().mockReturnThis(),
    isLength: jest.fn().mockReturnThis(),
    not: jest.fn().mockReturnThis(),
    isEmpty: jest.fn().mockReturnThis(),
  };

  beforeEach(() => {
    body.mockImplementation(() => mockBody);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("validators get constructed succesfully", () => {
    require("../validators/auth.validator");
    const {
      trim,
      not,
      isEmpty,
      custom,
      isEmail,
      normalizeEmail,
      withMessage,
      isLength,
    } = mockBody;

    expect(trim).toHaveBeenCalled();
    expect(isEmpty).toHaveBeenCalled();
    expect(not).toHaveBeenCalled();
    expect(custom).toHaveBeenCalled();
    expect(isEmail).toHaveBeenCalled();
    expect(normalizeEmail).toHaveBeenCalled();
    expect(withMessage).toHaveBeenCalled();
    expect(isLength).toHaveBeenCalled();
  });
});
