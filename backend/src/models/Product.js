import {DataTypes} from 'sequelize';
import sequelize from '../config/database.js';
import ProductGroup from './ProductGroup.js';

const Product = sequelize.define('Product', {
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: {msg: 'Name is required'},
        },
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: {args: [0], msg: 'Price must be >= 0'},
        },
    },
    image: {
        type: DataTypes.STRING(512),
        allowNull: true,
        validate: {
            isUrl(value) {
                if (value == null) return;
                if (typeof value === 'string' && value.startsWith('"') && value.endsWith('"')) {
                    try {
                        value = JSON.parse(value);
                    } catch {
                    }
                }
                try {
                    new URL(value);
                } catch {
                    throw new Error('Image must be a valid URL');
                }
            },
        }
    },
}, {
    tableName: 'products',
    timestamps: true,
    underscored: true,
});

Product.belongsTo(ProductGroup, {
    foreignKey: {
        name: 'groupId',
        allowNull: true,
    },
    as: 'group',
});

ProductGroup.hasMany(Product, {
    foreignKey: {
        name: 'groupId',
        allowNull: true,
    },
    as: 'products',
});

export default Product;