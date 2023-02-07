'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Boardgame extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Boardgame.init({
    gameName: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING,
      validate: {
        len: [1, 50],
        isAGameILike(value) { // Can refer to other properties using this.otherPropertyName
          if (value.charAt(0) !== 'D') {
            throw new Error('Only games I like can be added to the DB')
          }
        }
      }
    },
    maxPlayers: {
      allowNull: false,
      type: DataTypes.INTEGER,
      validate: {
        max: 10,
        min: 1
      }
    },
    genre: {
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Boardgame',
  });
  return Boardgame;
}; 