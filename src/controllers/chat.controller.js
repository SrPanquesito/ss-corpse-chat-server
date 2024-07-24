const Users = require('#models/users.model');

const getAllUsersRaw = async (req, res, next) => {
    try {
        const loggedUserId = req.userId;
        const users = await Users.findAll();
        if (!users) {
            const error = new Error('Failed to retrieve all users from DB.');
            error.statusCode = 401;
            throw error;
        }

        let mappedUsers = users.map(user => {
            const userJson = user.toJSON();
            return {
                id: userJson.id,
                username: userJson.username,
                email: userJson.email,
                profilePictureUrl: userJson.profilePictureUrl,
                status: userJson.status
            };
        });

        // Don't show the logged in user in the contacts
        mappedUsers = mappedUsers.filter(user => user.id !== loggedUserId);

        res.status(200).json({
            message: 'Retrieved all users successfully!',
            contacts: mappedUsers
        });
    } catch (error) {
        if (!error.statusCode) { error.statusCode = 500 };
        next(error);
    }
};

module.exports = {
    getAllUsersRaw
};