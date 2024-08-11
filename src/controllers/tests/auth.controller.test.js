jest.mock("bcrypt");
jest.mock("#clients/aws.s3.client");
jest.mock("#controllers/utils/validationResultChecker");
jest.mock("#models/users.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("#models/users.model");
const controller = require("../auth.controller");
const {
  errorsOnValidation,
} = require("#controllers/utils/validationResultChecker");
const {
  mockResponse,
  dummyRequest,
  dummyUser,
} = require("../../../tests/mock/config.mock");

describe("src/controllers/auth.controller.js", () => {
  const mockUserCreate = jest.fn();
  const mockUserFindOne = jest.fn();
  const mockUserFindByPk = jest.fn();
  const mockJwtSign = jest.fn();
  const mockBcryptCompare = jest.fn();
  let res, req, next;

  beforeEach(() => {
    req = dummyRequest;
    res = mockResponse();
    next = jest.fn();
    Users.create = mockUserCreate.mockResolvedValue(dummyUser);
    Users.findOne = mockUserFindOne.mockResolvedValue(dummyUser);
    Users.findByPk = mockUserFindByPk.mockResolvedValue(dummyUser);
    bcrypt.compare = mockBcryptCompare.mockResolvedValue(true);
    jwt.sign = mockJwtSign.mockReturnValue(dummyUser.token);
    errorsOnValidation.mockImplementation(() => false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    test("successfull response", async () => {
      await controller.register(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        errorMessage: null,
        data: {
          id: dummyUser.id,
          email: dummyUser.email,
          token: dummyUser.token,
        },
      });
    });

    test("successfull response without file", async () => {
      req.file = null;

      await controller.register(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        errorMessage: null,
        data: {
          id: dummyUser.id,
          email: dummyUser.email,
          token: dummyUser.token,
        },
      });
    });

    test("error validation failed", async () => {
      errorsOnValidation.mockImplementation(() => true);

      await controller.register(req, res, next);

      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    test("error with status code 503", async () => {
      const error = new Error("Database connection failed");
      error.statusCode = 503;
      mockUserCreate.mockImplementation(() => {
        throw error;
      });

      await controller.register(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    test("error with status code 500", async () => {
      const error = new Error("User creation failed");
      mockUserCreate.mockImplementation(() => {
        throw error;
      });

      await controller.register(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("login", () => {
    test("successfull response", async () => {
      await controller.login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        errorMessage: null,
        data: {
          id: dummyUser.id,
          email: dummyUser.email,
          token: dummyUser.token,
        },
      });
    });

    test("error with status code 404 - user not found", async () => {
      const error = new Error("A user with this email could not be found.");
      error.statusCode = 401;
      mockUserFindOne.mockResolvedValue(null);

      await controller.login(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    test("error with status code 401 - wrong password", async () => {
      const error = new Error("Wrong password!");
      error.statusCode = 401;
      mockBcryptCompare.mockResolvedValue(false);

      await controller.login(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    test("error with status code 503", async () => {
      const error = new Error("Database connection failed");
      error.statusCode = 503;
      mockUserFindOne.mockImplementation(() => {
        throw error;
      });

      await controller.login(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    test("error with status code 500", async () => {
      const error = new Error("User creation failed");
      mockUserFindOne.mockImplementation(() => {
        throw error;
      });

      await controller.login(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
