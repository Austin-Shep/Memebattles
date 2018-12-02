module.exports = function (sequelize, DataTypes) {

    //this will create our table of memes in mysql
    var Memes = sequelize.define("Memes", {
        health: DataTypes.INTEGER,
        attack_Power: DataTypes.INTEGER,
        dice: DataTypes.INTEGER
    })

    //this allows us use a foreign key on memes so we can pull the users owned memes 
    Memes.associate = function (models) {
        Memes.belongsTo(models.User, {
            foriegnKey: {
                allowNull: true
            }
        });
    }
    return Memes;
};