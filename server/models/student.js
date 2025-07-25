'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Student.belongsTo(models.Class, {
        foreignKey: 'class',
        as: 'classInfo'
      });
    }
  }
  Student.init({
    name: DataTypes.STRING,
    class: DataTypes.INTEGER,
    gender: DataTypes.STRING,
    mobile: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    profile: DataTypes.STRING,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Student',
  });
  return Student;
};