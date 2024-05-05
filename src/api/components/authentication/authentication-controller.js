const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');

let failedLoginAttempts = {}; // Menyimpan jumlah percobaan login yang gagal
const LOGIN_LIMIT = 5; // Batasan jumlah percobaan login yang gagal
const LOGIN_TIMEOUT = 30 * 60 * 1000; // Jangka waktu dalam milidetik (30 menit)

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function login(request, response, next) {
  const { email, password } = request.body;

  try {
    // Check if the user has exceeded the maximum failed login attempts
    if (failedLoginAttempts[email] >= LOGIN_LIMIT) {
      const lastAttemptTime = failedLoginAttempts[`${email}_lastAttempt`] || 0;
      const currentTime = new Date().getTime();
      const timeDiff = currentTime - lastAttemptTime;

      if (timeDiff < LOGIN_TIMEOUT) {
        throw errorResponder(
          errorTypes.FORBIDDEN,
          'Too many failed login attempts.'
        );
      } else {
        // Reset failed login attempts counter and last attempt time
        failedLoginAttempts[email] = 0;
        failedLoginAttempts[`${email}_lastAttempt`] = 0;
      }
    }

    // Check login credentials
    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    if (!loginSuccess) {
      // Increase failed login attempts counter and update last attempt time
      failedLoginAttempts[email] = (failedLoginAttempts[email] || 0) + 1;
      failedLoginAttempts[`${email}_lastAttempt`] = new Date().getTime();

      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Wrong email or password'
      );
    }

    // Reset failed login attempts counter and last attempt time on successful login
    failedLoginAttempts[email] = 0;
    failedLoginAttempts[`${email}_lastAttempt`] = 0;

    return response.status(200).json(loginSuccess);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};
