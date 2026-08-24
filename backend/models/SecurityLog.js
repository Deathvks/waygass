module.exports = (sequelize, DataTypes) => {
  const SecurityLog = sequelize.define('SecurityLog', {
    ip: { type: DataTypes.STRING, allowNull: false },
    method: { type: DataTypes.STRING(10), allowNull: false },
    path: { type: DataTypes.STRING, allowNull: false },
    statusCode: { type: DataTypes.INTEGER },
    userAgent: { type: DataTypes.TEXT },
    userId: { type: DataTypes.INTEGER },
    eventType: { 
      type: DataTypes.STRING(20), 
      allowNull: false,
      defaultValue: 'REQUEST'
      // REQUEST, LOGIN_OK, LOGIN_FAIL, BLOCKED, RATE_LIMITED
    },
    detail: { type: DataTypes.TEXT } // extra info like attempted email
  }, {
    tableName: 'SecurityLogs',
    timestamps: true,
    updatedAt: false, // only need createdAt
    indexes: [
      { fields: ['ip'] },
      { fields: ['eventType'] },
      { fields: ['createdAt'] }
    ]
  });

  return SecurityLog;
};
