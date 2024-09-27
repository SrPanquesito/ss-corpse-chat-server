const mockResponse = () => {
    const res = {}
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    return res
}

const dummyUser = {
    id: '1',
    email: 'test@example.com',
    username: 'testuser',
    password: 'password123',
    status: 'ACTIVE',
    profilePictureUrl: 'mockedProfilePictureUrl',
    token: 'mockedToken',
    toJSON: () => ({ ...dummyUser }),
}

const dummyUsers = [
    { ...dummyUser, toJSON: () => ({ ...dummyUsers[0] }) },
    {
        ...dummyUser,
        id: '2',
        email: 'test2@example2.com',
        username: 'testuser2',
        toJSON: () => ({ ...dummyUsers[1] }),
    },
    {
        ...dummyUser,
        id: '3',
        email: 'test3@example3.com',
        username: 'testuser3',
        toJSON: () => ({ ...dummyUsers[2] }),
    },
]

const dummyUsersFindAndCountAll = {
    count: 3,
    rows: dummyUsers,
}

const dummyMessage = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    text: 'Hello, this is a test message.',
    imageUrl: 'http://example.com/image.jpg',
    status: 'unseen',
    toJSON: () => ({ ...dummyMessage }),
}

const dummyMessages = [
    {
        ...dummyMessage,
        id: '1',
        text: 'Hello, this is a test message.',
        toJSON: () => ({ ...dummyMessages[0] }),
    },
    {
        ...dummyMessage,
        id: '2',
        text: 'Hello, this is a test message.',
        toJSON: () => ({ ...dummyMessages[1] }),
    },
    {
        ...dummyMessage,
        id: '3',
        text: 'Hello, this is a test message.',
        toJSON: () => ({ ...dummyMessages[2] }),
    },
]

const dummyMessagesFindAndCountAll = {
    count: 3,
    rows: dummyMessages,
}

const dummyRequest = {
    userId: dummyUser.id,
    body: {
        email: dummyUser.email,
        username: dummyUser.password,
        password: dummyUser.password,
        sender: dummyUsers[0],
        receiver: dummyUsers[1],
        message: dummyMessage.text,
        imageUrl: 'http://example.com/image.jpg',
    },
    file: {
        originalname: 'profile.jpg',
        mimetype: 'image/jpeg',
        buffer: 'base64encodedstring',
    },
    query: {
        id: 'id',
        page: 1,
        pageSize: 5,
    },
}

module.exports = {
    mockResponse,
    dummyRequest,
    dummyUser,
    dummyUsers,
    dummyUsersFindAndCountAll,
    dummyMessage,
    dummyMessages,
    dummyMessagesFindAndCountAll,
}
