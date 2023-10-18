const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const MenuRole = sequelize.define('menuRole', {
            id: {
                field: 'ID',
                type: 'UNIQUEIDENTIFIER',
                allowNull: false,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            empId: {
                field: 'EMP_ID',
                type: Sequelize.STRING,
                allowNull: false
            },
            roleCode: {
                field: 'ROLE_CODE',
                type: Sequelize.STRING,
                allowNull: true
            },
            status: {
                field: 'ACTIVE',
                type: Sequelize.BOOLEAN,
                allowNull: true
            },
            createdDate: {
                field: 'CREATED_DATE',
                type: DataTypes.STRING,
                allowNull: true,
            },
            createdBy: {
                field: 'CREATED_BY',
                type: DataTypes.STRING,
                allowNull: true
            },
            updatedDate: {
                field: 'UPDATED_DATE',
                type: DataTypes.STRING,
                allowNull: true,
            },
            updatedBy: {
                field: 'UPDATED_BY',
                type: DataTypes.STRING,
                allowNull: true
            },
        },
        {
            tableName: 'MAS_MENU_ROLE',
            timestamps: false,
            charset: 'utf8'
        });

    MenuRole.associate = (m) => {
        m.menuRole.belongsTo(m.empRole, { foreignKey: 'roleCode' });
        m.menuRole.belongsToMany(m.menu, {
            foreignKey: 'menuRoleId',
            through: m.permissionMenu,
            otherKey: 'menuCode',
        });
    }

    return MenuRole;
}