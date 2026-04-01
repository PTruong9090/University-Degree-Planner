import sequelize from "../config/database.js";
import "../models/index.js";

await sequelize.authenticate()
await sequelize.sync()

console.log('DB synced')
process.exit(0)

