const Joi = require('joi');

module.exports = {
    login: {
        body: Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required()
        }),
    },

    createUser: {
        body: Joi.object({
            fullname: Joi.string(),
            email: Joi.string().email().required(),
            password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required()
        }),
    },
    
    forgotPassword: {
        body: Joi.object({
            email: Joi.string().email().required(),
        }),
    },

    resetPassword: {
        body: Joi.object({
            token: Joi.string().required(),
            password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required()
        }),
    }
};
