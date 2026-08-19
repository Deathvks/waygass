'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'lastName', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '' // Necesario para no romper filas existentes que no tengan apellido
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'lastName');
  }
};
