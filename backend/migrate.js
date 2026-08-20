const db = require('./models');

async function migrate() {
  console.log("Iniciando migración de la base de datos...");
  try {
    await db.users.sync({ alter: true });
    console.log("¡Migración de la tabla de usuarios completada con éxito!");
  } catch (err) {
    console.error("Error durante la migración:", err);
  }
  process.exit();
}

migrate();
