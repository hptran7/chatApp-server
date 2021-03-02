"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addConstraint("Users", {
      fields: ["userName"],
      type: "unique",
      name: "adding-unique-constraint-to-userName",
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint(
      "Users",
      "adding-unique-constraint-to-userName"
    );
  },
};
