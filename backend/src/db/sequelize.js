import { Sequelize } from 'sequelize'
import { ENV } from './env.js';

new Sequelize(
  ENV.DATABASE_URL,
  {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
)

