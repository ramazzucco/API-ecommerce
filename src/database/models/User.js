module.exports = (sequelize, DataTypes) => {

    const cols = {
        first_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        city: {
            type: DataTypes.STRING,
            allowNull: true
        },
        avatar: DataTypes.STRING,
        status: DataTypes.INTEGER
    }

    const config = {
        tableName : 'users',
        timestamps: false
    }

    const User = sequelize.define('User',cols,config);

    User.associate = function(models) {
        User.hasMany(models.Order,{
            as: 'orders',
            foreignKey: 'users_id'
        });
        User.belongsToMany(models.Product,{
            as: 'products',
            through: 'user_product',
            foreignKey: 'users_id',
            otherKey: 'products_id',
            // timestamps: false
        });
        User.hasMany(models.Message,{
            as: "messages",
            foreignKey: "users_id"
        })
    }

    return User;

};