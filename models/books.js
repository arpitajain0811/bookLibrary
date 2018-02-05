'use strict';
module.exports = (sequelize, DataTypes) => {
  var books = sequelize.define('books', {
    id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    author: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return books;
};