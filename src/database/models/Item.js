module.exports = (sequelize, DataTypes) => {
    const cols = {
        products_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        orders_id:{
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        price:{
            type: DataTypes.DECIMAL.UNSIGNED,
            allowNull: false
        },
        quantity:{
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        name:{
            type: DataTypes.STRING,
            allowNull: false
        },
        discount:{
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        priceWithoutDiscount:{
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        image:{
            type: DataTypes.STRING,
            allowNull: false
        }
    }

    const config = {
        tableName : 'items',
        timestamps: false
    }

    const Item = sequelize.define('Item',cols,config);

    Item.associate = function(models) {

        Item.hasOne(models.Product,{
            as: "product",
            foreignKey: "id"
        });
        Item.belongsTo(models.Order,{
            as: "order",
            foreignKey: "orders_id"
        });

    }

    return Item;

}