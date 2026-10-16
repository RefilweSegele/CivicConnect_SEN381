function errorHandler(err, req, res, next) {
  console.error(err.stack);

  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(400).json({ success: false, message: err.message });
  }

  res.status(500).json({ error: 'Something went wrong' });
}

module.exports = errorHandler;