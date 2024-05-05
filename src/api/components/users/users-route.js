const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const usersControllers = require('./users-controller');
const usersValidator = require('./users-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/users', route);

  // Get list of users
  route.get('/', authenticationMiddleware, usersControllers.getUsers);

  // Create user
  route.post(
    '/',
    authenticationMiddleware,
    celebrate(usersValidator.createUser),
    usersControllers.createUser
  );

  // Get user detail
  route.get('/:id', authenticationMiddleware, usersControllers.getUser);

  // Update user
  route.put(
    '/:id',
    authenticationMiddleware,
    celebrate(usersValidator.updateUser),
    usersControllers.updateUser
  );

  // Delete user
  route.delete('/:id', authenticationMiddleware, usersControllers.deleteUser);

  // Change password
  route.post(
    '/:id/change-password',
    authenticationMiddleware,
    celebrate(usersValidator.changePassword),
    usersControllers.changePassword
  );

  // Create purchase
  route.post(
    '/purchases',
    authenticationMiddleware,
    celebrate(usersValidator.createPurchase),
    usersControllers.createPurchase
  );

  // Get list of purchases
  route.get(
    '/purchases/list',
    authenticationMiddleware,
    usersControllers.getPurchases
  );

  // Get purchase detail
  route.get(
    '/purchases/:id',
    authenticationMiddleware,
    usersControllers.getPurchase
  );

  // Update purchase
  route.put(
    '/purchases/:id',
    authenticationMiddleware,
    celebrate(usersValidator.updatePurchase),
    usersControllers.updatePurchase
  );

  // Delete purchase
  route.delete(
    '/purchases/:id',
    authenticationMiddleware,
    usersControllers.deletePurchase
  );
};
