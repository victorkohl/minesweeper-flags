'use strict';

/**
 * Gets called if a parameter is missing and the expression
 * specifying the default value is evaluated.
 */
export function missingParam(parameter) {
  let message = 'Missing parameter';
  if (parameter) {
    message += `: ${parameter}`;
  }
  throw new Error(message);
}
