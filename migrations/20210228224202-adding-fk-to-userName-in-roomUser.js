"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addConstraint("roomUsers", {
      fields: ["userName"],
      type: "FOREIGN KEY",
      name: "adding-fk-to-userName-in-roomUsers",
      references: {
        table: "Users",
        field: "userName",
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint(
      "roomUsers",
      "adding-fk-to-userName-in-roomUsers"
    );
  },
};
