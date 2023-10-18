module.exports = (sequelize, DataTypes) => {
    const TTS = sequelize.define('tts', {
            tDate: {
                field: 'TASK_DATE',
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            empId: {
                field: 'EMP_ID',
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            brnCode: {
                field: 'BRN_CODE',
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            score: {
                field: 'SCORE',
                type: DataTypes.INTEGER,
                allowNull: true
            },
            totalTask: {
                field: 'TOTAL_TASK',
                type: DataTypes.INTEGER,
                allowNull: true
            },
            completeTask: {
                field: 'COMPLETE_TASK',
                type: DataTypes.INTEGER,
                allowNull: true
            },
            createdDate: {
                field: 'CREATED_DATE',
                type: 'TIMESTAMP',
                defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
            },
            createdBy: {
                field: 'CREATED_BY',
                type: DataTypes.STRING,
                allowNull: true
            },
            updatedDate: {
                field: 'UPDATED_DATE',
                type: DataTypes.DATE,
                defaultValue: null
            },
            updatedBy: {
                field: 'UPDATED_BY',
                type: DataTypes.STRING,
                defaultValue: null
            },
        },
        {
            tableName: 'TRN_TASK_SCORE',
            timestamps: false,
            charset: 'utf8'
        });

    return TTS;
}