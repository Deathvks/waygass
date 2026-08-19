module.exports = (sequelize, DataTypes) => {
  const Validation = sequelize.define("Validation", {
    stationId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true // Can be anonymous
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true
    },
    type: {
      type: DataTypes.ENUM('PRICE_CORRECT', 'WRONG_PRICE', 'CLOSED'),
      allowNull: false
    }
  });

  return Validation;
};
