/**
 * Gets called if a required parameter is missing and the expression
 * specifying the default value is evaluated.
 * @param {string} parameter name
 * @throws {Error}
 */
export function requiredParam(parameter) {
  let message = 'Missing parameter';
  if (parameter) {
    message += `: ${parameter}`;
  }
  throw new Error(message);
}
