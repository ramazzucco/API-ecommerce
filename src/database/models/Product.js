module.exports = (sequelize, DataTypes) => {
    const cols = {
        category_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        marca: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false
        },
        stock: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true
        },
        discount: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        }
    }

    const config = {
        tableName : 'products',
        timestamps: false
    }

    const Product = sequelize.define('Product',cols,config);

    Product.associate = function(models) {

        Product.belongsTo(models.Category,{
            as: "category",
            foreignKey: "category_id"
        });
        Product.hasOne(models.Item,{
            as: "item",
            foreignKey: "products_id"
        });
        Product.hasOne(models.Promotion,{
            as: "promotion",
            foreignKey: "products_id"
        });
        Product.belongsToMany(models.User,{
            as: "users",
            through: 'user_product',
            foreignKey: 'products_id',
            otherKey: 'users_id'
        });

    }

    return Product;

}