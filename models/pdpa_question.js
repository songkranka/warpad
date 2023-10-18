const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const _pdpaQuestion = sequelize.define('pdpaQuestion', {
            id: {
                field: 'ID',
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            versionNo: {
                field: 'VERSION_NO',
                type: DataTypes.STRING,
                allowNull: false
            },
            questionNo: {
                field: 'QUESTION_NO',
                type: DataTypes.INTEGER,
                allowNull: false
            },
            questionText: {
                field: 'QUESTION_TEXT',
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
            tableName: 'MAS_PDPA_QUESTION',
            timestamps: false,
            charset: 'utf8'
        });

    return _pdpaQuestion;
}