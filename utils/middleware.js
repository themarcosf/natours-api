/**
 * wrapper function to catch errors in async functions
 *
 * @param {function} fn
 * @returns void
 */
const asyncHandler = function (fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
};

module.exports = asyncHandler;
