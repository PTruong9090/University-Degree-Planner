import { Sequelize } from 'sequelize'
import { ENV } from './env.js';

const isProd = ENV.NODE_ENV === "production";

const sequelize = new Sequelize(
  ENV.DB_NAME,
  ENV.DB_USER,
  ENV.DB_PASSWORD,
  {
    host: ENV.DB_HOST,
    port: ENV.DB_PORT,
    dialect: 'postgres',
    logging: false,
    dialectOptions: isProd ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    } : {}
  }
)

export default sequelize
