"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addConstraint("roomUsers", {
      fields: ["userId"],
      type: "FOREIGN KEY",
      name: "adding-fk-to-userId",
      references: {
        table: "Users",
        field: "id",
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint("roomUsers", "adding-fk-to-userId");
  },
};
