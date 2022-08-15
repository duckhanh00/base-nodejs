const { UserService } = require('./user.service');

const { catchWrap } = require('../../helpers/catchWrap')

const createUser = async (req, res) => {
    try {
        let user = await UserService.createUser(req.body);
        res.status(200).json({
            success: true,
            messages: ['create_user_success'],
            content: user
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ['create_user_failure'],
            content: error
        });
    };
}

const getUserById = async (req, res) => {
    try {
        let user = await UserService.getUserById(req.params.userId);

        res.status(200).json({
            success: true,
            content: user
        });
    } catch (error) {
        console.log(error)
        res.status(400).json({
            success: false,
            content: error
        });
    };
}

const getUsers = catchWrap(async (req, res) => {
    let users = await UserService.getUsers(req.query);

    res.status(200).json({
        success: true,
        content: users
    });
})

const deleteUser = catchWrap(async (req, res) => {
    await UserService.deleteUser(req.params.userId)

    res.status(200).json({
        success: true
    })
})

const deleteSoftUser = catchWrap(async (req, res) => {
    await UserService.deleteSoftUser(req.params.userId)

    res.status(200).json({
        success: true
    })
})

const restoreUser = catchWrap(async (req, res) => {
    await UserService.restoreUser(req.params.userId)

    res.status(200).json({
        success: true
    })
})

exports.UserController = {
    createUser: createUser,
    getUserById: getUserById,
    getUsers: getUsers,
    deleteUser: deleteUser,
    deleteSoftUser: deleteSoftUser, 
    restoreUser: restoreUser
}