const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const Menu = sequelize.define('menu', {
            menuCode: {
                field: 'MENU_CODE',
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            menuName: {
                field: 'MENU_NAME',
                type: DataTypes.STRING,
                allowNull: false
            },
            menuLink: {
                field: 'MENU_LINK',
                type: DataTypes.STRING,
                allowNull: false
            },
            status: {
                field: 'ACTIVE',
                type: DataTypes.BOOLEAN,
                allowNull: false
            },
            createdDate: {
                field: 'CREATED_DATE',
                type: 'TIMESTAMP',
                defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
                allowNull: true,
            },
            createdBy: {
                field: 'CREATED_BY',
                type: DataTypes.STRING,
                allowNull: false
            },
            updatedDate: {
                field: 'UPDATED_DATE',
                type: 'TIMESTAMP',
                defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
                allowNull: true,
            },
            updatedBy: {
                field: 'UPDATED_BY',
                type: DataTypes.STRING,
                allowNull: false
            },
            menuIcon: {
                field: 'MENU_ICON',
                type: DataTypes.STRING,
                allowNull: false
            },
            gMenuCode: {
                field: 'GROUP_MENU_CODE',
                type: DataTypes.UUID,
                allowNull: false
            },
        },
        {
            tableName: 'MAS_MENU',
            timestamps: false,
            charset: 'utf8'
        });

    return Menu;
}