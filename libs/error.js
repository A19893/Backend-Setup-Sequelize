/* eslint-disable snakecasejs/snakecasejs */
const { Sequelize } = require("sequelize");
const { http_status_code } = require("./constants");

/**
 * Handles errors and sends an appropriate HTTP response.
 * @param {object} res - The Express response object.
 * @param {Error} err - The error object.
 */
function handle_error(res, err) {
  // Log the error for debugging purposes
  // console.error('\nError:', err.name);

  // Default values for error handling
  let error_message = "Internal Server Error";
  let status_code = http_status_code.INTERNAL_SERVER;

  // Extracts the validation message from a Sequelize unique error
  if (err instanceof Sequelize.UniqueConstraintError) {
    // const errors = err.errors.map((err) => ({
    //   field: err.path,
    //   message: err.message,
    // }));
    return res.status(http_status_code.CONFLICT).json({error: "Bad request, check the request payload."});
  }

  // Extracts the validation message from a Sequelize validation error
  if (err instanceof Sequelize.ValidationError) {
    // const errors = err.errors.map((err) => ({
    //   field: err.path,
    //   message: err.message,
    // }));
    return res
      .status(http_status_code.BAD_REQUEST)  
      .json({ error: "Bad request, check the request payload."});
  }

  if (err instanceof Sequelize.DatabaseError) {
    if (err.parent.code === '22P02') {
      return res.status(http_status_code.BAD_REQUEST).json({ error: "Provided uuid is invalid." });
    } else if (err.parent.code === '21000') {
      return res.status(http_status_code.CONFLICT).json({ error: "Same resource already exists" });
    }
  }

  // Extracts the validation message from a Sequelize during bulk insert
  if (err instanceof Sequelize.AggregateError) {
    // const errors = err.errors.map((err) => ({
    //   field: err.path,
    //   message: err.message,
    // }));
    return res.status(http_status_code.BAD_REQUEST).json({ error: "Invalid payload." });
  }
  
  if(err.message === 'WHERE parameter "uuid" has invalid "undefined" value') {
    return res.status(http_status_code.BAD_REQUEST).json({ error: "UUID is not valid." });
  }

  if (err.name === 'SequelizeDatabaseError' && err.parent?.code === '22P02') { 
    return res.status(http_status_code.BAD_REQUEST).json({ error: "Provided uuid is invalid." });
  }
  // Customize error handling based on the type of error
  if (err instanceof custom_error) {
    error_message = err.message;
    status_code = err.status_code;
  }
  
  if(err instanceof validation_error){
    error_message = JSON.parse(err.message);
    status_code = err.status_code;
    return res.status(status_code).json(error_message);
  }
  // Send the appropriate response to the client
  res.status(status_code).json({
    error: error_message,
  });
}

/**
 * Custom error class for handling specific error cases.
 */
class custom_error extends Error {
  constructor(message, status_code = http_status_code.BAD_REQUEST) {
    super(message);
    this.status_code = status_code;
  }
}

class validation_error extends Error {
  constructor(message, status_code = http_status_code.BAD_REQUEST) {
    super(JSON.stringify(message));
    this.status_code = status_code;
  }
}

module.exports = {
  handle_error,
  custom_error,
  validation_error
};
