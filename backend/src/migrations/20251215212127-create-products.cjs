'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('products', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            price: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
            },
            image: {
                type: Sequelize.STRING(512),
                allowNull: true,
            },
            groupId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'product_groups',
                    key: 'id',
                },
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });

        await queryInterface.addIndex('products', ['groupId'], {
            name: 'products_group_id_idx',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('products');
    }
};
