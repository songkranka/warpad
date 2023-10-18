const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const _Emp = sequelize.define('emp', {
            empId: {
                field: 'EMP_ID',
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            empName: {
                field: 'EMP_FULLNAME_TH',
                type: DataTypes.STRING,
                allowNull: false
            },
            posCode: {
                field: 'POS_CODE',
                type: DataTypes.STRING,
                allowNull: false
            },
            posName: {
                field: 'POS_NAME_TH',
                type: DataTypes.STRING,
                allowNull: true
            },
            deptCode: {
                field: 'DEPT_CODE',
                type: DataTypes.STRING,
                allowNull: true
            },
            deptName: {
                field: 'DEPT_NAME_TH',
                type: DataTypes.STRING,
                allowNull: true
            },
            jobTitle: {
                field: 'JOB_TITLE',
                type: DataTypes.STRING,
                allowNull: true
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
            },
            startWorkDate: {
                field: 'START_WORK_DATE',
                type: Sequelize.STRING,
                allowNull: true
            }
        },
        {
            tableName: 'MAS_EMPLOYEE',
            timestamps: false,
            charset: 'utf8'
        });

    _Emp.associate = (m) => {
        m.emp.belongsTo(m.empPos, { foreignKey: 'posCode' })
    }

    return _Emp;
}