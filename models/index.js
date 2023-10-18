const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(module.filename);
const config = require('../configs/app');
const db = {};

const sequelize = new Sequelize(config.database.dbname, config.database.user, config.database.password, {
    host: config.database.server,
    port: config.database.port,
    // operatorsAliases: false,
    dialect: 'mssql',
    logging: false,
    timezone: '+07:00',
    pool: {
        max: config.database.max_pool,
        min: config.database.min_pool,
        requestTimeout: config.database.idle_time
    },
    dialectOptions: {
        charset: 'UTF8',
        options: {
            encrypt: true,
            trustServerCertificate: false
        }
    }
});

fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf(".") !== 0) && (file !== basename) && (file.slice(-3) === ".js");
    })
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
    })

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;