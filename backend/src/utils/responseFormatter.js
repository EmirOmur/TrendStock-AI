/**
 * Wraps a successful payload in the standard API envelope.
 * @param {*} data - The response payload
 * @returns {Object} Formatted success response
 */
export function formatSuccess(data) {
  return {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Wraps an error message in the standard API envelope.
 * @param {string} message - Human-readable error description
 * @returns {Object} Formatted error response
 */
export function formatError(message) {
  return {
    success: false,
    error: message,
    timestamp: new Date().toISOString(),
  };
}
