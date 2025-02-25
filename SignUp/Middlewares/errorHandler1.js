// errorHandler.js
const errorHandler1 = (err, req, res, next) => {
  console.error('Login Error:', err.stack); // Log the error specifically as a login error for easier debugging

  if (err.status === 400) {
    // Handle client errors (e.g., user not found or incorrect password)
    return res.status(400).json({
      message: err.message || 'Bad Request',
    });
  }

  // Handle other errors (e.g., server issues)
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler1;
