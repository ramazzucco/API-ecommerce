module.exports = (sequelize, DataTypes) => {
    const cols = {
        products_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        numero: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
    }

    const config = {
        tableName : 'visitas',
        timestamps: false
    }

    const Visita = sequelize.define('Visita',cols,config);

    Visita.associate = function(models) {

        // Visita.belongsTo(models.User,{
        //     as: "user",
        //     foreignKey: "id"
        // });

    }

    return Visita;

}