module.exports = function(sequelize, DataTypes) {
  //this will create our table of memes in mysql
  var Memes = sequelize.define("Memes", {
    name: DataTypes.STRING,
    link: DataTypes.STRING,
    attack_power: DataTypes.INTEGER,
    health_points: DataTypes.INTEGER,
    cost: DataTypes.DECIMAL(10, 2),
    dice_value: DataTypes.INTEGER
  });

  return Memes;
};
