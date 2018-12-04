module.exports = function(sequelize, DataTypes) {
  //exact replica of memes except this is going to have a foreign key
  var Boughten_Memes = sequelize.define("Boughten_Memes", {
    name: DataTypes.STRING,
    link: DataTypes.STRING,
    attack_power: DataTypes.INTEGER,
    health_points: DataTypes.INTEGER,
    cost: DataTypes.INTEGER,
    dice_value: DataTypes.INTEGER
  });

  //this allows multiple users to buy the same meme
  Boughten_Memes.associate = function(models) {
    Boughten_Memes.belongsTo(models.User, {
      forignKey: {
        allowNull: true
      }
    });
  };
  return Boughten_Memes;
};
