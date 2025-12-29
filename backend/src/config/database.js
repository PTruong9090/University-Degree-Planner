import { Sequelize } from 'sequelize'
import { ENV } from './env.js';

const isRDS = ENV.DB_HOST && !ENV.DB_HOST.includes('localhost');

const sequelize = new Sequelize(
  ENV.DB_NAME,
  ENV.DB_USER,
  ENV.DB_PASSWORD,
  {
    host: ENV.DB_HOST,
    port: ENV.DB_PORT,
    dialect: 'postgres',
    logging: false,
    dialectOptions: isRDS ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    } : undefined,
  }
)

export default sequelize
