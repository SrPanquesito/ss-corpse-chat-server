const express = require("express");
const { registerValidator } = require("#validators/auth.validator");
const AuthController = require("#controllers/auth.controller");

jest.mock("express");
jest.mock("#controllers/auth.controller");

describe("src/routes/auth.router.js", () => {
  const mockPost = jest.fn();
  const mockRouter = {
    post: mockPost,
  };

  beforeEach(() => {
    express.Router.mockReturnValue(mockRouter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("auth routes are defined", () => {
    require("../auth.router");
    expect(mockPost.mock.calls[0]).toStrictEqual([
      "/register",
      registerValidator,
      AuthController.register,
    ]);
    expect(mockPost.mock.calls[1]).toStrictEqual([
      "/login",
      AuthController.login,
    ]);
  });
});
