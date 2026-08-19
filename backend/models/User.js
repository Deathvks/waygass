module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    role: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'user'
    },
    subscription: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'basic'
    },
    tankSize: {
      type: Sequelize.INTEGER,
      defaultValue: 50
    },
    gpsApp: {
      type: Sequelize.STRING,
      defaultValue: 'gmaps'
    },
    isPro: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    cardWaylet: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    cardCepsa: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  });

  return User;
};
