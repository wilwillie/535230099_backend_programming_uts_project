const usersRepository = require('./users-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');
const { description } = require('../../../models/purchases-schema');
const { update } = require('lodash');

/**
 * Get list of users with pagination, sorting, and filtering
 * @param {Object} options - Pagination, sorting, and filtering options
 * @returns {Object} - Paginated result
 */
async function getUsers(options) {
  // Default options
  const {
    page_number = 1,
    page_size = 10,
    sort = 'email:asc',
    search,
  } = options;

  // Parse sort and search options
  const [sortField, sortOrder] = sort.split(':');
  const [searchField, searchKey] = search ? search.split(':') : [null, null];

  // Get total count of users
  const totalCount = await usersRepository.getUsersCount(
    searchField,
    searchKey
  );

  // Calculate pagination
  const totalPages = Math.ceil(totalCount / page_size);
  const offset = (page_number - 1) * page_size;

  // Get users with pagination, sorting, and filtering
  const users = await usersRepository.getUsersWithPagination(
    offset,
    page_size,
    sortField,
    sortOrder,
    searchField,
    searchKey
  );

  // Prepare response
  const response = {
    page_number,
    page_size,
    count: users.length,
    total_pages: totalPages,
    has_previous_page: page_number > 1,
    has_next_page: page_number < totalPages,
    data: users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
    })),
  };

  return response;
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(name, email, password) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check whether the email is registered
 * @param {string} email - Email
 * @returns {boolean}
 */
async function emailIsRegistered(email) {
  const user = await usersRepository.getUserByEmail(email);

  if (user) {
    return true;
  }

  return false;
}

/**
 * Check whether the password is correct
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function checkPassword(userId, password) {
  const user = await usersRepository.getUser(userId);
  return passwordMatched(password, user.password);
}

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function changePassword(userId, password) {
  const user = await usersRepository.getUser(userId);

  // Check if user not found
  if (!user) {
    return null;
  }

  const hashedPassword = await hashPassword(password);

  const changeSuccess = await usersRepository.changePassword(
    userId,
    hashedPassword
  );

  if (!changeSuccess) {
    return null;
  }

  return true;
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createPurchase(product, description, price, quantity) {
  try {
    await usersRepository.createPurchase(product, description, price, quantity);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Get list of purchases
 * @returns {Array}
 */
async function getPurchases() {
  const purchases = await usersRepository.getPurchases();

  const results = [];
  for (let i = 0; i < purchases.length; i += 1) {
    const purchase = purchases[i];
    results.push({
      product: purchase.product,
      description: purchase.description,
      price: purchase.price,
      quantity: purchase.quantity,
    });
  }

  return results;
}

/**
 * Get purchase detail
 * @param {string} id - Purchase ID
 * @returns {Object}
 */
async function getPurchase(id) {
  const purchase = await usersRepository.getPurchase(id);

  // Purchase not found
  if (!purchase) {
    return null;
  }

  return {
    product: purchase.product,
    description: purchase.description,
    price: purchase.price,
    quantity: purchase.quantity,
  };
}

/**
 * Update existing purchase
 * @param {string} id - Purchase ID
 * @param {string} price - Price
 * @param {string} quantity - Quantity
 * @returns {boolean}
 */
async function updatePurchase(id, price, quantity) {
  const purchase = await usersRepository.getPurchase(id);

  // Purchase not found
  if (!purchase) {
    return null;
  }

  try {
    await usersRepository.updatePurchase(id, price, quantity);
  } catch (err) {
    return null;
  }

  return true;
}
/**
 * Delete user
 * @param {string} id - Purchase ID
 * @returns {boolean}
 */
async function deletePurchase(id) {
  const purchase = await usersRepository.getPurchase(id);

  // Purchase not found
  if (!purchase) {
    return null;
  }

  try {
    await usersRepository.deletePurchase(id);
  } catch (err) {
    return null;
  }

  return true;
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  emailIsRegistered,
  checkPassword,
  changePassword,
  createPurchase,
  getPurchases,
  getPurchase,
  updatePurchase,
  deletePurchase,
};
