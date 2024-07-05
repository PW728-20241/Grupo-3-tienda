import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("tercerintento", "tercerintento", "Abc$1234", {
    host: "tercerintento.postgres.database.azure.com",
    dialect: "postgres"
});
