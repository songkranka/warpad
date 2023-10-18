const Sequelize = require("sequelize");
const Menu = require('./menu');

module.exports = (sequelize, DataTypes) => {
     const GMenu = sequelize.define('gMenu', {
            gMenuCode: {
                field: 'GROUP_MENU_CODE',
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4
            },
            gName: {
                field: 'GROUP_NAME',
                type: DataTypes.STRING,
                allowNull: false
            },
            gMenuIcon: {
                field: 'GROUP_MENU_ICON',
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            tableName: 'MAS_GROUP_MENU',
            timestamps: false,
            charset: 'utf8'
        });

     GMenu.associate = (m) => {
         m.gMenu.hasMany(m.menu, { foreignKey: 'gMenuCode' })
     }

    return GMenu;
}