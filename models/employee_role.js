const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const EmpRole = sequelize.define('empRole', {
            roleCode: {
                field: 'ROLE_CODE',
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            roleName: {
                field: 'ROLE_NAME',
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
                allowNull: true
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
                allowNull: true
            },
        },
        {
            tableName: 'MAS_EMPLOYEE_ROLE',
            timestamps: false,
            charset: 'utf8'
        });

    EmpRole.associate = (m) => {
        m.empRole.belongsTo(m.menuRole, { foreignKey: 'roleCode' });
    }

    return EmpRole;
}