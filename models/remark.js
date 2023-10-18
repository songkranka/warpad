const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const _Remark = sequelize.define('remark', {
            remarkCode: {
                field: 'REMARK_CODE',
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            remarkDesc: {
                field: 'REMARK_DESC',
                type: DataTypes.STRING,
                allowNull: false
            },
            createdDate: {
                field: 'CREATED_DATE',
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW'),
                allowNull: true,
            },
            createdBy: {
                field: 'CREATED_BY',
                type: DataTypes.STRING,
                allowNull: false
            },
            updatedDate: {
                field: 'UPDATED_DATE',
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW'),
                allowNull: true,
            },
            updatedBy: {
                field: 'UPDATED_BY',
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            tableName: 'MAS_REMARK',
            timestamps: false,
            charset: 'utf8'
        });

    return _Remark;
}