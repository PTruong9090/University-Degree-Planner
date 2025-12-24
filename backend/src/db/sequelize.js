import { Sequelize } from "sequelize";
import { ENV } from "../config/env.js";

const sequelize = new Sequelize(ENV.DATABASE_URL, {
    dialect: 'postgres',
    logging: false
})

export default sequelize;