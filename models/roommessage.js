'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class roomMessage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  roomMessage.init({
    roomId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    userName: DataTypes.STRING,
    message: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'roomMessage',
  });
  return roomMessage;
};