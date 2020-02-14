/* eslint-disable no-else-return */
import db from '../../models';
import {
  successResponse, failureResponse,
} from '../../commonHelpers';
import { formatUserData, getUser, generateToken, verifyPassword } from './helpers';

const { User, Event } = db;

export default {
  /**
   * Creates a user.
   * @param {Object} req The request object.
   * @param {Object} res The response object.
   * @returns {Object} The response object containing some response data.
   */
  async signup(req, res) {
    const {
      name, email, password,
    } = res.locals.formattedInputs;
    const user = await getUser(User, email);
    if (user) {
      return failureResponse(res, 'User already exist');
    } else {
      const newUser = new User({
        name,
        email,
        password,
      });
      await newUser.save();
      const payload = { token: generateToken(formatUserData(newUser)) };
      return successResponse(res, 'User created', payload, 201);
    }
  },

  /**
   * Grants authentication to a registered user.
   * @param {Object} req The request object.
   * @param {Object} res The response object.
   * @returns {Object} The response object containing some response data.
   */
  async signin(req, res) {
    const { email, password } = res.locals.formattedInputs;
    const user = await getUser(User, email);
    if (!user) {
      return failureResponse(res, 'Email or password incorrect', {}, 404);
    } else if (verifyPassword(password, user.password)) {
      const payload = { token: generateToken(formatUserData(user)) };
      return successResponse(res, 'Logged in', payload);
    } else {
      return failureResponse(res, 'Email or password incorrect');
    }
  },

  async changePassword(req, res) {
    const { formerpassword, newpassword } = res.locals.formattedInputs;
    const user = res.locals.currentUser;
    if (verifyPassword(formerpassword, user.password)) {
      user.password = newpassword;
      await user.save();
      return successResponse(res, 'Password changed');
    } else {
      return failureResponse(res, 'The former password is incorrect');
    }
  },

  /**
   * Creates an admin user.
   * @param {Object} req The request object.
   * @param {Object} res The response object.
   * @returns {Object} The response object containing some response data.
   */
  async createAdmin(req, res) {
    const { email } = res.locals.formattedInputs;
    const user = await getUser(User, email);
    if (!user) {
      return failureResponse(res, 'User not found', {}, 404);
    } else if (user.role === 'admin' || user.role === 'superAdmin') {
      return failureResponse(res, 'The user is already an admin', {}, 409);
    } else {
      user.role = 'admin';
      await user.save();
      return successResponse(res, 'The user has been updated to become an admin');
    }
  },

  /**
   * Deletes a user.
   * @param {Object} req The request object.
   * @param {Object} res The response object.
   * @returns {Object} The response object containing some response data.
   */
  async deleteUser(req, res) {
    const userPassword = res.locals.formattedInputs.password;
    const user = res.locals.currentUser;
    if (verifyPassword(userPassword, user.password)) {
      await User.remove({ email: user.email });
      // Delete all the users event
      await Event.remove({ userId: user._id });
      return successResponse(res, 'user deleted');
    } else {
      return failureResponse(res, 'password incorrect');
    }
  },
};
