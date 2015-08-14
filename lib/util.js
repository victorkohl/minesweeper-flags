/**
 * Gets called if a required parameter is missing and the expression
 * specifying the default value is evaluated.
 */
export function requiredParam(parameter) {
  let message = 'Missing parameter';
  if (parameter) {
    message += `: ${parameter}`;
  }
  throw new Error(message);
}
