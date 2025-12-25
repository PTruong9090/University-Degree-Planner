import sequelize from "./sequelize.js";
import "../models/course.model.js"

await sequelize.authenticate()
await sequelize.sync()

console.log('DB synced')
process.exit(0)

