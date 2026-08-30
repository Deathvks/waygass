const db = require('./models/index.js');
(async () => {
  console.log("Fixing Favorites table...");
  await db.Favorite.sync({ force: true });
  console.log("Favorites table has been recreated to fix the broken UNIQUE constraint.");
  process.exit(0);
})();
