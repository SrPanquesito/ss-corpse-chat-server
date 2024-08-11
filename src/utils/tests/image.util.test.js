jest.mock("path");
jest.mock("fs");
const { clearImage } = require("../image.util");
const { unlink } = require("fs");

describe("src/utils/image.util.js", () => {
  beforeEach(() => {
    // Mock console.log
    console.log = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("succesfully clears image", () => {
    const filePath = "/uploads/test.jpg";
    clearImage(filePath);

    expect(console.log).not.toHaveBeenCalled();
  });

  test("error on trying to clear image", () => {
    unlink.mockImplementation((path, callback) => {
      callback(new Error("unlink error")); // Error
    });
    const filePath = "/uploads/test.jpg";
    clearImage(filePath);

    expect(console.log).toHaveBeenCalled();
  });
});
