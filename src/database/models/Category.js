module.exports = (sequelize, DataTypes) => {
    const cols = {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }
    
    const config = {
        tableName : 'categorys',
        timestamps: false
    }

    const Category = sequelize.define('Category',cols,config);

    Category.associate = function(models) {
    
        Category.hasMany(models.Product,{
            as: "products",
            foreignKey: "category_id"
        });

    }

    return Category;

}