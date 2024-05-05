const { User } = require('../../../models');
const { Purchase } = require('../../../models');

/**
 * Get a list of users
 * @returns {Promise}
 */
async function getUsers() {
  return User.find({});
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getUser(id) {
  return User.findById(id);
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createUser(name, email, password) {
  return User.create({
    name,
    email,
    password,
  });
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateUser(id, name, email) {
  return User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
      },
    }
  );
}

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

/**
 * Get user by email to prevent duplicate email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

/**
 * Update user password
 * @param {string} id - User ID
 * @param {string} password - New hashed password
 * @returns {Promise}
 */
async function changePassword(id, password) {
  return User.updateOne({ _id: id }, { $set: { password } });
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createPurchase(product, description, price, quantity) {
  return Purchase.create({
    product,
    description,
    price,
    quantity,
  });
}

/**
 * Get list of users with optional pagination, sorting, and filtering
 * @param {number} offset - Offset for pagination
 * @param {number} limit - Limit for pagination
 * @param {string} sortField - Field to sort by
 * @param {string} sortOrder - Sort order
 * @param {string} searchField - Field to search
 * @param {string} searchKey - Search key
 * @returns {Promise<Array>} - Array of users
 */
async function getUsersWithPagination(
  offset,
  limit,
  sortField,
  sortOrder,
  searchField,
  searchKey
) {
  let query = {};

  // Apply search filter if provided
  if (searchField && searchKey) {
    query[searchField] = { $regex: searchKey, $options: 'i' };
  }

  // Apply sorting
  const sortOptions = {};
  sortOptions[sortField] = sortOrder === 'desc' ? -1 : 1;

  return User.find(query).sort(sortOptions).skip(offset).limit(limit);
}

/**
 * Get total count of users with optional search
 * @param {string} searchField - Field to search
 * @param {string} searchKey - Search key
 * @returns {Promise<number>} - Total count of users
 */
async function getUsersCount(searchField, searchKey) {
  let query = {};

  // Apply search filter if provided
  if (searchField && searchKey) {
    query[searchField] = { $regex: searchKey, $options: 'i' };
  }

  return User.countDocuments(query);
}

/**
 * Get a list of purchases
 * @returns {Promise}
 */
async function getPurchases() {
  return Purchase.find({});
}

/**
 * Get purchase detail
 * @param {string} id - Purchase ID
 * @returns {Promise}
 */
async function getPurchase(id) {
  return Purchase.findById(id);
}

/**
 * Update existing purchase
 * @param {string} id - Purchase ID
 * @param {string} price - Price
 * @param {string} quantity - Quantity
 * @returns {Promise}
 */
async function updatePurchase(id, price, quantity) {
  return Purchase.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        price,
        quantity,
      },
    }
  );
}

/**
 * Delete a purchase
 * @param {string} id - Purchase ID
 * @returns {Promise}
 */
async function deletePurchase(id) {
  return Purchase.deleteOne({ _id: id });
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  changePassword,
  createPurchase,
  getUsersWithPagination,
  getUsersCount,
  getPurchases,
  getPurchase,
  updatePurchase,
  deletePurchase,
};
