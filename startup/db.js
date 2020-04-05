const mongoose = require('mongoose'); 
const winston = require('winston');

module.exports = function() {
  mongoose
    .connect(
      process.env.MONGODB_URL,
      { useUnifiedTopology: true, useNewUrlParser: true }
    )
    .then(() => winston.info("Database connected"))
    .catch(err => winston.error(err));
};
