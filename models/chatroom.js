'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class chatRoom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  chatRoom.init({
    host: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'chatRoom',
  });
  return chatRoom;
};