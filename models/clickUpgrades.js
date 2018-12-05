module.exports = function (sequelize, DataTypes) {
    var ClickerUpgrades = sequelize.define("ClickerUpgrades", {
        clickPower: DataTypes.INTEGER,
        morePerClick: DataTypes.DECIMAL(10, 2),
        cost: DataTypes.DECIMAL(10, 2)
    })
    return ClickerUpgrades;
}