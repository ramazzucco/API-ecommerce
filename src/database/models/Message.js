module.exports = (sequelize, DataTypes) => {
    const cols = {
        users_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        to_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        products_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true
        },
        from_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        to_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        avatar: {
            type: DataTypes.STRING,
            allowNull: false
        },
        product_link: {
            type: DataTypes.STRING,
            allowNull: true
        },
        date: {
            type: DataTypes.STRING,
            allowNull: false
        }

    }

    const config = {
        tableName : 'messages',
        timestamps: false
    }

    const Message = sequelize.define('Message',cols,config);

    Message.associate = function(models) {

        Message.belongsTo(models.User,{
            as: "user",
            foreignKey: "id"
        });

    }

    return Message;

}