module.exports = (sequelize, DataTypes) => {
    return sequelize.define('vBranch', {
            brnCode: {
                field: 'BRN_CODE',
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            brnName: {
                field: 'BRN_NAME',
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            tableName: 'V_BRANCH',
            timestamps: false,
            charset: 'utf8'
        });
}