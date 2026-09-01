const path = require('path');
const Sequelize = require('sequelize');

const checkReal = async () => {
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'waygas.sqlite'),
    logging: false
  });
  
  const RealUser = require('./models/User')(sequelize, Sequelize);
  const RealBlocked = require('./models/BlockedIP')(sequelize, Sequelize);
  
  const user = await RealUser.findOne({ where: { email: 'dylanjesussuarez@gmail.com' } });
  if (user) {
    console.log("Real User isVerified:", user.isVerified, "role:", user.role);
    if (!user.isVerified) {
      user.isVerified = true;
      await user.save();
      console.log("Forced isVerified to true!");
    }
  } else {
    console.log("Real user not found?!");
  }
  
  const blocked = await RealBlocked.findAll();
  console.log("Blocked IPs in real DB:", blocked.map(b => b.ip));
  
  await RealBlocked.destroy({ where: { ip: '::1' } });
  await RealBlocked.destroy({ where: { ip: '127.0.0.1' } });
  console.log("Cleaned localhost from real DB just in case.");
};
checkReal();
