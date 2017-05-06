'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.requiredParam = requiredParam;
/**
 * Gets called if a required parameter is missing and the expression
 * specifying the default value is evaluated.
 */
function requiredParam(parameter) {
  var message = 'Missing parameter';
  if (parameter) {
    message += ': ' + parameter;
  }
  throw new Error(message);
}