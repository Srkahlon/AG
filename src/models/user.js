'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.Employee,{foreignKey: 'user_id',as: 'employee'})
    }
  };
  User.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    first_name: { type: DataTypes.STRING, allowNull: false },
    last_name: { type: DataTypes.STRING, allowNull: false },
    email_id: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};