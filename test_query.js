const db = require('./backend/models');
async function test() {
  const count = await db.PriceHistory.count();
  console.log("Total history rows:", count);
  const row = await db.PriceHistory.findOne();
  if (row) {
    console.log("Found station:", row.stationId);
    const history = await db.PriceHistory.findAll({ where: { stationId: row.stationId }, order: [['date', 'DESC']], limit: 30 });
    console.log("History for this station:", history.length, "rows.");
    console.log(history.map(h => ({ date: h.date, p95: h.price95 })));
  }
}
test();
