"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addConstraint("roomUsers", {
      fields: ["roomId"],
      type: "FOREIGN KEY",
      name: "adding-fk-to-roomId",
      references: {
        table: "chatRooms",
        field: "id",
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint("roomUsers", "adding-fk-to-roomId");
  },
};
