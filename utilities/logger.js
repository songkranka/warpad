var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'info';
log4js.configure({
    appenders: { 'file': { type: 'file', filename: 'logs//masterdata.log' , pattern: 'yyyy-MM-dd', compress: false} },
    categories: { default: { appenders: ['file'], level: 'debug' } }
  });

  function info(msg){
    logger.info(msg);
  }
  function debug(msg){
    logger.debug(msg);
  }
  function error(msg){
    logger.error(msg);
  }

  module.exports = {
    info,debug,error
};