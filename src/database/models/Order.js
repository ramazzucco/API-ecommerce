module.exports = (sequelize, DataTypes) => {
    const cols = {
        items_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        users_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        number: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        date: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }

    const config = {
        tableName : 'orders',
        timestamps: false
    }

    const Order = sequelize.define('Order',cols,config);

    Order.associate = function(models) {

        Order.hasMany(models.Item,{
            as: "items",
            foreignKey: "id"
        });
        Order.belongsTo(models.User,{
            as: "user",
            foreignKey: "users_id"
        });
    }

    return Order;

}