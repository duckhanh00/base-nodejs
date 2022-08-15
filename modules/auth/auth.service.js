const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const emailValidator = require('deep-email-validator');
const crypto = require('crypto');

const { User } = require('../../models');
const { sendEmail }= require('../../helpers/sendEmail')

const login = async (data) => {
    const { email, password } = data;
    // let checkValidEmail = await emailValidator.validate(email)

    // if (!checkValidEmail?.valid) {
    //     throw 'email_invalid'
    // }

    let token;
    let user = await User.findOne({ "email": email }).populate({ path: "roles" });

    if (!user) {
        throw { message: 'login_invalid' };
    } else {
        let checkPassword = bcrypt.compareSync(password, user.password);
        if (!checkPassword) {
            throw { message: 'login_invalid' };
        } else {
            token = jwt.sign({ user: user }, process.env.SECRET_TOKEN);
        }
    }  

    return {
        user: {
            email: user.email,
            fullname: user.fullname,
            roles: user.roles
        },
        token: token
    };
}

const loginOAuth = async (session) => {
    const { token, expires, userId } = session

    if (token && expires >= Date.now()) {
        let tokenLogin;
        let user = await User.findOne({ _id: userId });
        tokenLogin = jwt.sign({ id: user._id }, process.env.SECRET_TOKEN);

        return {
            user: user,
            token: tokenLogin
        };
    } else {
        throw {
            message: 'login_valid'
        }
    }
}

const updateStatus = async (data) => {
    const { email, status } = data

    let checkValidEmail = await emailValidator.validate(email)

    if (!checkValidEmail?.valid) {
        throw 'email_invalid'
    }

    user = await User.update(
        { email: email },
        {
            status: status
        }
    )

    return
}

/** Render page nhap email tai khoan quen mk */
const getRequestForgotPassword = async (req, res) => {
    res.render('reset-password/forgotPassword');
}

/** Xu ly request forgot password
 * Gui mail xac thuc de reset password
 */
const forgotPassword = async (req, res) => {
    const { email } = req.body

    // Validate email and user
    let checkValidEmail = await emailValidator.validate(email)

    if (!checkValidEmail?.valid) {
        throw 'email_invalid'
    }

    let user = await User.findOne({ email: email })

        if (!user) {
        throw 'user_not_exist'
    }

    // Update reset password token
    let token = await crypto.randomBytes(16)?.toString('hex')

    await User.update(
            { email: email },
            {
                $set: {
                    resetPasswordToken: token,
                    resetPasswordExpires: Date.now() + 10000000
                }
            }
        )

    // send mail to reset password
    let mailOptions = {
        receiver: user.email,
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/auth/user/reset-password/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'

    };

    await sendEmail(mailOptions)
}

/** Render page reset password */
const getRequestResetPassword = async (req, res) => {
    let user = await User.findOne({ 
        resetPasswordToken: req.params.token, 
        resetPasswordExpires: { $gt: Date.now() } 
    })

    // Forward ve page forgot password
    if (!user) {
        res.redirect('/auth/user/forgot-password');
        return
    }
    
    await res.render('reset-password/resetPassword', {
        user: user
    });
}

/** Reset password */
const resetPassword = async (req, res) => {
    const { token, password } = req.body

    let user = await User.findOne({ 
            resetPasswordToken: token, 
            resetPasswordExpires: { $gt: Date.now() }
        })

    if (!user) {
        throw "user_not_exist"
    }

    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);

    await User.update(
            { 
                resetPasswordToken: token,
                resetPasswordExpires: { $gt: Date.now() }
            },
            {
                $set: {
                    password: hash,
                    resetPasswordToken: undefined,
                    resetPasswordExpires: undefined
                }
            }
        )
} 

exports.AuthService = {
    login: login,
    loginOAuth: loginOAuth,
    updateStatus: updateStatus,
    getRequestForgotPassword: getRequestForgotPassword,
    forgotPassword: forgotPassword,
    getRequestResetPassword: getRequestResetPassword,
    resetPassword: resetPassword
}