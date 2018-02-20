
module.exports = (sequelize, DataTypes) => {
  const likes = sequelize.define('likes', {
    bookId: {type: DataTypes.INTEGER, unique:true},
    liked: { type: DataTypes.INTEGER, defaultValue: 0 },
  }, {
    classMethods: {
      associate(models) {
        // associations can be defined here
      },
    },
  });
  return likes;
};
