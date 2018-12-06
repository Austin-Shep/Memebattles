module.exports = function (sequelize, DataTypes) {
    var PurchasedClickerUpgrades = sequelize.define("PurchasedClickerUpgrades", {
        clickPower: DataTypes.INTEGER,
        morePerClick: DataTypes.DECIMAL(10, 2),
        cost: DataTypes.DECIMAL(10, 2)
    });
    PurchasedClickerUpgrades.associate = function (models) {
        PurchasedClickerUpgrades.belongsTo(models.User, {
            forignKey: {
                allowNull: true
            }
        });
    };
    return PurchasedClickerUpgrades;
};