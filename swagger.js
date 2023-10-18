const swaggerAutogen = require('swagger-autogen')();
const configs = require('./configs/app')

const doc = {
  info: {
    title: 'MasterData API',
    description: 'Descripttion',
    version: configs.app_version,    
  },
  host: configs.base_url,
  schemes: ['https','http'],
};

const outputFile = './swagger_output.json';
const endpointsFiles = [
  './controllers/branch_active.controller.js',
  './controllers/branch.controller.js',
  './controllers/employee_pos.controller.js',
  './controllers/employee_role.controller.js',
  './controllers/employee.controller.js',
  './controllers/healthcheck.controller.js',
  './controllers/menu_role.controller.js',
  './controllers/menu.controller.js',
  './controllers/task_cat.controller.js',
  './controllers/task_sub_cat.controller.js',
  './controllers/sla.controller.js',
  './controllers/member.controller.js'
];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./index');
  });
