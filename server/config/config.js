const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS || null,
    database: process.env.DB_NAME || 'database_development',
    host: process.env.DB_HOST,
    dialect: 'mysql'
  },
  test: {
    username: process.env.DB_USER_TEST,
    password: process.env.DB_PASS_TEST || null,
    database: process.env.DB_NAME_TEST || 'database_test',
    host: process.env.DB_HOST_TEST,
    dialect: 'mysql'
  },
  production: {
    username: process.env.DB_USER_PROD,
    password: process.env.DB_PASS_PROD || null,
    database: process.env.DB_NAME_PROD || 'database_production',
    host: process.env.DB_HOST_PROD,
    dialect: 'mysql'
  }
};
