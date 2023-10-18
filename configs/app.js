const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: parseInt(process.env.PORT_APP) || 3000,
  base_url: process.env.BASE_URL || 'localhost:3000',
  app_version: process.env.VERSION,
  // path_api_configmap: "/usr/src/app/appConfigs/mapper",
  // path_url_configmap: "/usr/src/app/appConfigs/backend",
  // path_message_configmap: "/usr/src/app/appConfigs/message",
  // path_query_configmap: "/usr/src/app/appConfigs/query",
  path_api_configmap: "D:\\configwarpad/mapper",
  path_url_configmap: "D:\\configwarpad/backend",
  path_message_configmap: "D:\\configwarpad/message",
  path_query_configmap: "D:\\configwarpad/query",
  api_mapper_Config: "api-configs-map.json",
  web_url_config: "backend-configs-map.json",
  message_config: "message-configs.json",
  query_config: "query-configs.json",
  notify_config: "notify-configmap.json",
  database: {
    // server: process.env.DB_ENDPOINT || "server-sql-all-dev.database.windows.net",
    // port: parseInt(process.env.DB_PORT) || 1433,
    // user: process.env.DB_USER  || "warpad_app",
    // password: process.env.DB_PASSWORD || "pV9C*7-EkXLua&HeFxfY#V7?",
    // dbname: process.env.DB_NAME || "sql-warpad-dev",
    server: process.env.DB_ENDPOINT || "prd-warpad-aks-serversql.database.windows.net",
    port: parseInt(process.env.DB_PORT) || 1433,
    user: process.env.DB_USER  || "warpad_app",
    password: process.env.DB_PASSWORD || "TtJ$=YcLcH-JhfjBn4pb&hdt",
    dbname: process.env.DB_NAME || "sql-warpad-prod",
    min_pool: parseInt(process.env.DB_MINPOOL) || 0,
    max_pool: parseInt(process.env.DB_MAXPOOL) || 30,
    idle_time: parseInt(process.env.DB_IDLETIME) || 30000,
  },
  apiCrm:{
    endpoint: "https://ptnewcrm-qas.pt.co.th:40443/pt-uat-pcp8082/ws_ptg_crm_war_pad.asmx",
    soapAction: "http://tempuri.org/GetTop20Customer"
  },
  secret: 'warpad-secret-auth',
  refreshTokenSecret: 'warpad-secret-refresh-auth',
  tokenLife: '15m',
  refreshTokenLife: '30m'
}