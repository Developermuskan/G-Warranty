// resources/userResource.js

/**
 * Formats a single user object
 * @param {Object} user - raw user object from DB
 * @returns {Object} formatted user
 */
function single(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

/**
 * Formats an array of users
 * @param {Array} users - array of raw user objects from DB
 * @returns {Array} array of formatted users
 */
function collection(users) {
  return users.map(single);
}

module.exports = { single, collection };
