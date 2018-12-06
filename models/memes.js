module.exports = function(sequelize, DataTypes) {
  //this will create our table of memes in mysql
  var Memes = sequelize.define("Memes", {
    name: DataTypes.STRING,
    link: DataTypes.STRING,
    lvl: DataTypes.INTEGER,
    ac: DataTypes.INTEGER,
    attack_power: DataTypes.INTEGER,
    health_points: DataTypes.INTEGER,
    cost: DataTypes.INTEGER,
    dice_value: DataTypes.INTEGER
  });

  return Memes;
};
