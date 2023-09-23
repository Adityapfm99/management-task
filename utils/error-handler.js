function errorHandler(err, req, res, next) {
    console.error('=========',err.stack); // Log the error for debugging
  
    // Check if the error is a mongoose CastError (invalid ObjectId)
    if (err instanceof CastError) {
      return res.status(400).json({ message: 'Invalid Task ID' });
    }
  
    // Handle other errors
    res.status(404).json({ message: err.message });
  }
  
  module.exports = errorHandler;
  