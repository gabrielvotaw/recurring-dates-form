/**
 * Normalizes a string for use in weak comparisons.
 *
 * @param {string} string - The string to normalize.
 *
 * @returns {string} - The normalized string.
 */
const normalizeString = (string) => string.replace(/\s+/g, ' ').trim();

module.exports = {
  normalizeString,
};
