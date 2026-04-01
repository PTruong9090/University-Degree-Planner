import { Sequelize } from 'sequelize'
import { ENV } from './env.js';

const sequelizeOptions = {
  dialect: 'postgres',
  logging: false,
};

if (ENV.DB_SSL) {
  sequelizeOptions.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: ENV.DB_SSL_REJECT_UNAUTHORIZED,
    },
  };
}

const sequelize = ENV.DATABASE_URL
  ? new Sequelize(ENV.DATABASE_URL, sequelizeOptions)
  : new Sequelize(ENV.DB_NAME, ENV.DB_USER, ENV.DB_PASSWORD, {
      ...sequelizeOptions,
      host: ENV.DB_HOST,
      port: ENV.DB_PORT,
    });

export default sequelize
