const express = require('express');
const router = express.Router();
const { validate } = require('express-validation')

const { auth, role } = require('../../middleware')

const { UserController } = require('../../modules/user/user.controller');
const { UserValidation } = require('../../validations')


/**
 * @route GET /api/v1/user/users
 * @group User - Operations about user
 * @param {number} limit.query
 * @param {number} page.query
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.get('/users', validate(UserValidation.getUsers), auth([role.SYSTEMADMIN]), UserController.getUsers)

/**
 * @route GET /api/v1/user/users/{userId}
 * @group User - Operations about user
 * @param {string} userId.path.required
 * @returns {object} 200 - User info
 * @returns {Error}  default - Unexpected error
 */
router.get('/users/:userId', auth(), UserController.getUserById);

/**
 * @typedef ReqCreateUserJSON
 * @property {string} fullname - user's fullname - eg: Vu Nam
 * @property {string} email.required - user's email - eg: vunam722000@gmail.com
 * @property {string} password.required - user's password
 */
/**
 * @route POST /api/v1/user/users/
 * @group User - Operations about user
 * @param {ReqCreateUserJSON.model} body.body.required
 * @returns {object} 200 - User info
 * @returns {Error}  default - Unexpected error
 */
router.post('/users', validate(UserValidation.createUser), auth(), UserController.createUser);


/**
 * @route DELETE /api/v1/user/users/{userId}
 * @group User - Operations about passage
 * @param {string} userId.path.required
 * @returns {object} 200 - User info
 * @returns {Error}  default - Unexpected error
 */
router.delete(
  "/users/:userId",
  auth([role.SYSTEMADMIN]),
  UserController.deleteUser
);

/**
 * @route PATCH /api/v1/user/users/{userId}/delete-soft
 * @group User - Operations about passage
 * @param {string} userId.path.required
 * @returns {object} 200 - User info
 * @returns {Error}  default - Unexpected error
 */
router.patch(
  "/users/:userId/delete-soft",
  auth([role.SYSTEMADMIN]),
  UserController.deleteSoftUser
);

/**
 * @route PATCH /api/v1/user/users/{userId}/restore
 * @group User - Operations about passage
 * @param {string} userId.path.required
 * @returns {object} 200 - User info
 * @returns {Error}  default - Unexpected error
 */
router.patch(
  "/users/:userId/restore",
  auth([role.SYSTEMADMIN]),
  UserController.restoreUser
);

module.exports = router;