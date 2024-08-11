jest.mock("#models/users.model", () => ({
  hasMany: jest.fn(),
}));
jest.mock("#models/messages.model", () => ({
  belongsTo: jest.fn(),
}));
const sequelize = require("../mysql.configuration");
const initializeSQLConnection = require("../mysql.init");

describe("src/database/mysql.init.js", () => {
  const mockLog = jest.fn();
  const mockError = jest.fn();

  beforeEach(() => {
    console.log = mockLog;
    console.error = mockError;

    sequelize.authenticate = jest.fn(() => Promise.resolve());
    sequelize.sync = jest.fn(() => Promise.resolve());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("initializeSQLConnection succesfully", async () => {
    await initializeSQLConnection();

    expect(mockLog).toHaveBeenCalledTimes(1);
    expect(mockLog.mock.calls[0][0]).toContain("success");
  });

  test("initializeSQLConnection error", async () => {
    sequelize.sync = jest.fn(() =>
      Promise.reject(new Error("Sequelize sync error")),
    );

    await initializeSQLConnection();

    expect(mockError).toHaveBeenCalledTimes(1);
    expect(mockError.mock.calls[0][0]).toContain("Unable to connect");
  });
});
