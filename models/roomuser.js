"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class roomUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.roomUser.belongsTo(models.chatRoom, {
        as: "roomDetail",
        foreignKey: "roomId",
      });
      models.roomUser.belongsTo(models.User, {
        as: "userDetail",
        foreignKey: "userId",
      });
    }
  }
  roomUser.init(
    {
      roomId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      userName: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "roomUser",
    }
  );
  return roomUser;
};
