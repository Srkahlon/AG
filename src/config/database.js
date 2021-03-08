require('dotenv').config();
module.exports = {
    dev : {
      host: process.env.HOST,
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      dialect: "postgres",
      quoteIdentifiers: false,
      freezeTableName: true,
      pool: {
        max: 15,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
};