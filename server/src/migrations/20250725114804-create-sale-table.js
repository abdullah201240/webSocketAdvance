'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('sales', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      productId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      productName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 1,
      },
      unitPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      totalPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      discount: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      },
      finalPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      customerId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      customerName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      paymentMethod: {
        type: Sequelize.ENUM('cash', 'card', 'mobile_payment', 'credit'),
        allowNull: false,
      },
      paymentStatus: {
        type: Sequelize.ENUM('pending', 'partial', 'paid'),
        defaultValue: 'pending',
      },
      saleerId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      SaleerName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      saleDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      invoiceNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      taxAmount: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      },
      notes: {
        type: Sequelize.TEXT,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    });

    await queryInterface.addIndex('sales', ['invoiceNumber'], { unique: true });
    await queryInterface.addIndex('sales', ['customerId']);
    await queryInterface.addIndex('sales', ['saleerId']);
    await queryInterface.addIndex('sales', ['saleDate']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('sales');
  }
};