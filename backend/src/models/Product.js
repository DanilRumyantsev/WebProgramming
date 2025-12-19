import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import ProductGroup from './ProductGroup.js';

const Product = sequelize.define('Product', {
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Name is required' },
        },
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: { args: [0], msg: 'Price must be >= 0' },
        },
    },
    image: {
        type: DataTypes.STRING(512),
        allowNull: true,
        validate: {
            isUrl: { msg: 'Image must be a valid URL' },
        },
    },
}, {
    tableName: 'products',
    timestamps: true,
    underscored: true,
});

Product.belongsTo(ProductGroup, {
    foreignKey: 'groupId',
    as: 'group',
});

ProductGroup.hasMany(Product, {
    foreignKey: 'groupId',
    as: 'products',
});

export default Product;