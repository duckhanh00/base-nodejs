const { AuthService } = require('./auth.service');

const login = async (req, res) => {
    try {
        let data = await AuthService.login(req.body);

        res.cookie('token', data.token, { 
            httpOnly: false,
            secure: false 
        });

        res.status(200).json({
            success: true,
            messages: ['login_success'],
            content: data
        });
    } catch (error) {
        let message = error && error.message === 'login_invalid' ? ['login_invalid'] : ['login_failure'];
        res.status(400).json({
            success: false,
            messages: message,
            content: error
        });
    };
}

const loginOAuth = async (req, res) => {
    try {
        let session = JSON.parse(req?.session?.passport?.user)
        data = await AuthService.loginOAuth(session)

        res.cookie('token', data.token, { 
            httpOnly: false,
            secure: false 
        });
        res.status(200).json({
            success: true,
            messages: ['create_user_success'],
            content: data
        });
    } catch (error) {
        req.session.destroy()
        res.status(400).json({
            success: false,
        });
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        req.session.destroy()
        res.status(200).json({
            success: true,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
        });
    }
}

const updateStatus = async (req, res) => {
    try {
        console.log(req?.session?.passport?.user, req.user)
        let user = await AuthService.updateStatus(req.query);
        res.status(200).json({
            success: true,
            messages: ['update_user_success'],
            content: user
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ['update_user_failure'],
            content: error
        });
    };
}

const forgotPassword = async (req, res) => {
    try {
        await AuthService.forgotPassword(req, res);

        res.status(200).json({
            success: true,
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            content: error
        });
    };
}

const getRequestForgotPassword = async (req, res) => {
    try {
        await AuthService.getRequestForgotPassword(req, res);
    } catch (error) {
        res.status(400).json({
            success: false,
            content: error
        });
    };
}

const getRequestResetPassword = async (req, res) => {
    try {
        await AuthService.getRequestResetPassword(req, res);
    } catch (error) {
        res.status(400).json({
            success: false,
            content: error
        });
    };
}

const resetPassword = async (req, res) => {
    try {
        await AuthService.resetPassword(req, res);

        res.status(200).json({
            success: true,
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            content: error
        });
    };
}

exports.AuthController = {
    login: login,
    loginOAuth: loginOAuth,
    logout: logout,
    updateStatus: updateStatus,
    forgotPassword: forgotPassword,
    getRequestForgotPassword: getRequestForgotPassword,
    getRequestResetPassword: getRequestResetPassword,
    resetPassword: resetPassword
}