const { Op } = require("sequelize");
const Users = require("#models/users.model");
const Messages = require("#models/messages.model");
// let { Upload } = require('@aws-sdk/lib-storage');
const {
  getAllUsersRaw,
  createMessage,
  getAllMessagesByContactId,
  uploadSingleImageToS3,
} = require("../chat.controller");
const {
  mockResponse,
  dummyRequest,
  dummyUsers,
  dummyMessage,
  dummyMessages,
} = require("../../../tests/mock/config.mock");

jest.mock("#models/users.model");
jest.mock("#models/messages.model");
jest.mock("@aws-sdk/client-s3");
jest.mock("@aws-sdk/lib-storage");
jest.mock("#clients/aws.s3.client");

describe("src/controllers/chat.controller.js", () => {
  const mockUserFindAll = jest.fn();
  const mockMessagesFindOne = jest.fn();
  const mockMessagesFindAll = jest.fn();
  let mappedUser;
  let mappedUserResponse;
  let res, req, next;

  beforeEach(() => {
    Op.ne = jest.fn();
    Op.or = jest.fn();
    req = dummyRequest;
    res = mockResponse();
    next = jest.fn();
    Users.findAll = mockUserFindAll.mockResolvedValue(dummyUsers);
    Messages.findOne = mockMessagesFindOne.mockResolvedValue(dummyMessage);
    Messages.update = jest.fn();
    Messages.findAll = mockMessagesFindAll.mockResolvedValue(dummyMessages);

    // Upload = jest.fn().mockImplementation(() => ({
    //     on: jest.fn().mockResolvedValue({progress: 100}),
    //     done: jest.fn().mockResolvedValue({Location: 'https://aws.s3.url'})
    // }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllUsersRaw", () => {
    beforeEach(() => {
      mappedUser = { ...dummyUsers[0] };
      delete mappedUser.password;
      delete mappedUser.toJSON;
      delete mappedUser.token;
      mappedUserResponse = { ...mappedUser, lastMessage: { ...dummyMessage } };
    });

    test("successfull response", async () => {
      await getAllUsersRaw(req, res, next);

      const { success, errorMessage, data } = res.json.mock.calls[0][0];

      expect(res.status).toHaveBeenCalledWith(200);
      expect(success).toBeTruthy();
      expect(errorMessage).toBeNull();
      expect(data[0]).toEqual(mappedUserResponse);
    });

    test("successfull response without last message retrieved", async () => {
      mockMessagesFindOne.mockResolvedValue(null);
      mappedUserResponse = { ...mappedUser };

      await getAllUsersRaw(req, res, next);

      const { success, errorMessage, data } = res.json.mock.calls[0][0];

      expect(res.status).toHaveBeenCalledWith(200);
      expect(success).toBeTruthy();
      expect(errorMessage).toBeNull();
      expect(data[0]).toEqual(mappedUserResponse);
    });

    test("error with status code 401", async () => {
      const error = new Error("Failed to retrieve all users from DB.");
      error.statusCode = 401;
      mockUserFindAll.mockResolvedValue(null);

      await getAllUsersRaw(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("createMessage", () => {
    beforeEach(() => {
      req = dummyRequest;
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("successfull response", async () => {
      await createMessage(req, res, next);

      const { success, errorMessage } = res.json.mock.calls[0][0];

      expect(res.status).toHaveBeenCalledWith(201);
      expect(success).toBeTruthy();
      expect(errorMessage).toBeNull();
    });

    test("successfull response without imageUrl, upload file to aws", async () => {
      delete req.body.imageUrl;

      await createMessage(req, res, next);

      const { success, errorMessage } = res.json.mock.calls[0][0];

      expect(res.status).toHaveBeenCalledWith(201);
      expect(success).toBeTruthy();
      expect(errorMessage).toBeNull();
    });

    test("error on create new message", async () => {
      await createMessage({}, res, next);

      const nextError = next.mock.calls[0][0];

      expect(nextError.message).toContain("Cannot destructure property");
    });
  });

  describe("getAllMessagesByContactId", () => {
    beforeEach(() => {
      req = { ...dummyRequest, params: { contactId: 123 } };
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("successfull response", async () => {
      await getAllMessagesByContactId(req, res, next);

      const { success, errorMessage, data } = res.json.mock.calls[0][0];

      expect(res.status).toHaveBeenCalledWith(200);
      expect(success).toBeTruthy();
      expect(errorMessage).toBeNull();
      expect(data[0]).toEqual(dummyMessages[0]);
    });

    test("error on create new message", async () => {
      mockMessagesFindAll.mockResolvedValue(null);

      await getAllMessagesByContactId(req, res, next);

      const nextError = next.mock.calls[0][0];

      expect(nextError.message).toContain(
        "Failed to retrieve messages from DB.",
      );
    });
  });

  describe("uploadSingleImageToS3", () => {
    beforeEach(() => {
      req = dummyRequest;
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("successfull response", async () => {
      await uploadSingleImageToS3(req, res, next);

      const { success, errorMessage } = res.json.mock.calls[0][0];

      expect(res.status).toHaveBeenCalledWith(201);
      expect(success).toBeTruthy();
      expect(errorMessage).toBeNull();
    });

    test("successfull response without file, do not upload any file to aws but return empty imageUrl", async () => {
      delete req.file;

      await uploadSingleImageToS3(req, res, next);

      const { success, errorMessage, data } = res.json.mock.calls[0][0];

      expect(res.status).toHaveBeenCalledWith(201);
      expect(success).toBeTruthy();
      expect(errorMessage).toBeNull();
      expect(data.imageUrl).toBe("");
    });

    test("error on create new message", async () => {
      await uploadSingleImageToS3(req, {}, next);

      const nextError = next.mock.calls[0][0];

      expect(nextError.message).toContain("res.status is not a function");
    });
  });
});
