const db = require('./models');
const Model = db.PriceHistory;
for (const attr in Model.rawAttributes) {
  if (Model.rawAttributes[attr].unique) console.log(attr + " has unique: " + Model.rawAttributes[attr].unique);
}
process.exit(0);
