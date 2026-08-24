module.exports = (sequelize, DataTypes) => {
  const BlockedIP = sequelize.define('BlockedIP', {
    ip: { type: DataTypes.STRING, allowNull: false, unique: true },
    reason: { type: DataTypes.STRING, defaultValue: 'Bloqueado manualmente' },
    blockedBy: { type: DataTypes.INTEGER } // admin userId
  }, {
    tableName: 'BlockedIPs',
    timestamps: true,
    updatedAt: false
  });

  return BlockedIP;
};
