const config = require('../configs/app')
const logger = require('./logger');
const sql = require('mssql')
const dbConfig = {
  user: config.database.user,
  password: config.database.password,
  database: config.database.dbname,
  server: config.database.server,
  port: config.database.port,
  pool: {
    max: config.database.max_pool,
    min: config.database.min_pool,
    idleTimeoutMillis: config.database.idle_time,
  },
  options: {
    encrypt: true, // for azure
    trustServerCertificate: false // change to true for local dev / self-signed certs
  }
}

const connectionPool = new sql.ConnectionPool(dbConfig);

connectionPool.on('error', err => {
    logger.error("dbConnectionString - SQL Server Initial Connection Pool Error : " + err);
});
    
module.exports = connectionPool;
