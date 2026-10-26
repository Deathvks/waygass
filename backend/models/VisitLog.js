module.exports = (sequelize, DataTypes) => {
  const VisitLog = sequelize.define('VisitLog', {
    ip: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    path: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '/'
    },
    category: {
      type: DataTypes.STRING(20), // 'blog' o 'app'
      allowNull: false,
      defaultValue: 'app'
    },
    referrer: {
      type: DataTypes.STRING(100),
      defaultValue: 'Directo / Marcadores'
    },
    referrerUrl: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    browser: {
      type: DataTypes.STRING(50),
      defaultValue: 'Desconocido'
    },
    os: {
      type: DataTypes.STRING(50),
      defaultValue: 'Desconocido'
    },
    device: {
      type: DataTypes.STRING(30), // 'Móvil', 'Tablet', 'Escritorio'
      defaultValue: 'Escritorio'
    },
    country: {
      type: DataTypes.STRING(100),
      defaultValue: 'Desconocido'
    },
    countryCode: {
      type: DataTypes.STRING(10),
      defaultValue: ''
    },
    city: {
      type: DataTypes.STRING(100),
      defaultValue: ''
    },
    region: {
      type: DataTypes.STRING(100),
      defaultValue: ''
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    userEmail: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    userName: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    tableName: 'VisitLogs',
    timestamps: true,
    updatedAt: false,
    indexes: [
      { fields: ['ip'] },
      { fields: ['category'] },
      { fields: ['createdAt'] },
      { fields: ['countryCode'] }
    ]
  });

  return VisitLog;
};
