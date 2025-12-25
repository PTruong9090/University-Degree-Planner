import { Sequelize } from "sequelize";
import { ENV } from "../config/env.js";

const sequelize = new Sequelize(ENV.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    ssl: {
        require: true,
        rejectUnauthorized: false
    }
})

await sequelize.authenticate()
console.log("Connected to AWS Postgres")

export default sequelize;