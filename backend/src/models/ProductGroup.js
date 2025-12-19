import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ProductGroup = sequelize.define('ProductGroup', {
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: { msg: 'Group name is required' },
        },
    },
}, {
    tableName: 'product_groups',
    timestamps: true,
    underscored: true,
});

export default ProductGroup;