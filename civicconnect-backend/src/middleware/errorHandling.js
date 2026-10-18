function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  if (status === 500) console.error(err.stack);
  res.status(status).json({ message: status === 500 ? 'Something went wrong' : err.message });
}

module.exports = errorHandler;