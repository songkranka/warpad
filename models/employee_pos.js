module.exports = (sequelize, DataTypes) => {
    const EmpPos = sequelize.define('empPos', {
            posCode: {
                field: 'POS_CODE',
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            nameEn: {
                field: 'NAME_EN',
                type: DataTypes.STRING,
                allowNull: true
            },
            nameTh: {
                field: 'NAME_TH',
                type: DataTypes.STRING,
                allowNull: true
            },
            minLvl: {
                field: 'MINLVL',
                type: DataTypes.SMALLINT,
                allowNull: true
            },
            maxLvl: {
                field: 'MAXLVL',
                type: DataTypes.SMALLINT,
                allowNull: true
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
            tableName: 'MAS_EMPLOYEE_POS',
            timestamps: false,
            charset: 'utf8'
        });

    return EmpPos;
}