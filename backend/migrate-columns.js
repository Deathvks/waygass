const db = require('./models');

const addColumns = async () => {
    try {
        await db.sequelize.query('ALTER TABLE users ADD COLUMN garage TEXT;');
        await db.sequelize.query('ALTER TABLE users ADD COLUMN activeGarageId VARCHAR(255);');
        await db.sequelize.query('ALTER TABLE users ADD COLUMN vehicleName VARCHAR(255);');
        await db.sequelize.query('ALTER TABLE users ADD COLUMN theme VARCHAR(255) DEFAULT "system";');
        console.log("Columnas añadidas con éxito.");
    } catch (e) {
        if (e.message.includes('duplicate column name')) {
            console.log("Las columnas ya existen en esta base de datos.");
        } else {
            console.error("Error alterando la tabla:", e);
        }
    }
    process.exit(0);
};

addColumns();
