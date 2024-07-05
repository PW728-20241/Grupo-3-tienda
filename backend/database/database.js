import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("grupotres", "grupotres", "Abc$1234", {
    host: "grupotres.postgres.database.azure.com",
    dialect: "postgres"
});