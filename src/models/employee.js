'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    static associate(models) {
        Employee.belongsTo(models.User, {
        foreignKey: 'user_id',
        targetKey: 'id',
        as: 'user'
      });
    }
  };
  Employee.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    user_id: DataTypes.INTEGER,
    employee_id: { type: DataTypes.STRING, allowNull: false },
    organization_name: { type: DataTypes.STRING, allowNull: false },
  }, {
    sequelize,
    modelName: 'Employee',
  });
  return Employee;
};