const { Upload } = require("@aws-sdk/lib-storage");
const { uploadFileToS3 } = require("../aws.s3.client");

jest.mock("@aws-sdk/client-s3");
jest.mock("@aws-sdk/lib-storage");

describe("src/clients/aws.s3.client.js", () => {
  const mockLog = jest.fn();
  const dummyFile = {
    originalname: "sample.name",
    mimetype: "sample.type",
    path: "sample.url",
    buffer: Buffer.from("whatever"), // this is required since `formData` needs access to the buffer
  };

  beforeEach(() => {
    console.log = mockLog;
    Upload.mockImplementation(() => {
      return {
        on: (event, callback) => {
          if (event === "httpUploadProgress") {
            callback({ loaded: 100, total: 100 });
          }
        },
        done: jest.fn().mockResolvedValue({ Location: "sample.url" }),
      };
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("upload file to aws s3 bucket succesfully", async () => {
    const uploadedFile = await uploadFileToS3(dummyFile);

    expect(uploadedFile).toBeDefined();
    expect(uploadedFile.Location).toBe("sample.url");
    expect(mockLog).toHaveBeenCalledTimes(1);
  });

  test("upload file to aws s3 throws error", async () => {
    Upload.mockImplementation(() => {
      throw new Error("Upload failed");
    });

    try {
      await uploadFileToS3(dummyFile);
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.message).toBe("Upload failed");
    }
  });
});
