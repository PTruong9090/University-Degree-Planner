import { Sequelize } from 'sequelize'
import { ENV } from './env.js';

const isRDS = ENV.DB_HOST && !ENV.DB_HOST.includes('localhost');

const sequelize = new Sequelize(
  ENV.DATABASE_URL,
  {
    dialect: 'postgres',
    protocol: 'postgres',
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
