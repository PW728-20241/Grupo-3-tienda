const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.grupotres, process.env.grupotres, process.env.Abc$1234, {
  host: process.env.grupotres.postgres.database.azure.com,
  dialect: "postgres",
});

module.exports = { sequelize };
