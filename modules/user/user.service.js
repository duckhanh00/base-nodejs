const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const emailValidator = require('deep-email-validator');

const { User } = require('../../models');
const { sendEmail }= require('../../helpers/sendEmail')

const createUser = async (data) => {
    const { fullname, email, password } = data;

    let checkValidEmail = await emailValidator.validate(email)

    if (!checkValidEmail?.valid) {
        throw 'email_invalid'
    }

    let user = await User.findOne({ email: email })
    
    if (user) {
        throw 'user_exist'
    }

    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);

    user = await User.create({
        fullname: fullname,
        email: email,
        password: hash,
        status: 'clone'
    })

    await sendEmail({
        receiver: email, 
        subject: 'Xác thực email', 
        html: `<a href='${process.env.HOST}:${process.env.PORT}/api/auth/user/update-status?email=${email}&status=active'>Xác thực</a>`
    })

    return user;
}

const getUserById = async (userId) => {
    let user = await User.findById(userId)

    return user
}

const getUsers = async (data) => {
    const { limit, page } = data

    let users = await User.paginate({}, {
        limit, page
    })

    return users
}

const deleteUser = async (userId) => {
    let user = await User.findById(userId, { _id: 1 }).lean()
    if (!user) {
        throw {
            message: "User not Found"
        }
    }

    await User.findByIdAndRemove(userId)
}

const deleteSoftUser = async (userId) => {
    let user = await User.findById(userId, { _id: 1 }).lean()
    if (!user) {
        throw {
            message: "User not Found"
        }
    }

    await User.findByIdAndUpdate(userId, {
        deleteSoft: true
    });
}

const restoreUser = async (userId) => {
    let user = await User.findById(userId, { _id: 1 }).lean()
    if (!user) {
        throw {
            message: "User not Found"
        }
    }

    await User.findByIdAndUpdate(userId, {
        deleteSoft: false
    });
}

exports.UserService = {
    createUser: createUser,
    getUserById: getUserById,
    getUsers: getUsers,
    deleteUser: deleteUser,
    deleteSoftUser: deleteSoftUser,
    restoreUser: restoreUser
}