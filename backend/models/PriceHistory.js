module.exports = (sequelize, DataTypes) => {
  const PriceHistory = sequelize.define('PriceHistory', {
    stationId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    price95: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    priceDiesel: {
      type: DataTypes.FLOAT,
      allowNull: true
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['stationId', 'date']
      }
    ]
  });

  return PriceHistory;
};
