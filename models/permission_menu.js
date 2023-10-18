module.exports = (sequelize, DataTypes) => {
    return sequelize.define('permissionMenu', {
            id: {
                field: 'ID',
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            menuRoleId: {
                field: 'MENU_ROLE_ID',
                type: DataTypes.UUID,
                allowNull: false,
            },
            menuCode: {
                field: 'MENU_CODE',
                type: DataTypes.STRING,
                allowNull: false
            },
            menuAction: {
                field: 'MENU_ACTION',
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            tableName: 'MAS_PERMISSION_MENU',
            timestamps: false,
            charset: 'utf8'
        });
}