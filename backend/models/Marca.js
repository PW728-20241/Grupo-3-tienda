import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Producto } from "./Producto.js";

export const Marca = sequelize.define(
  "Marca", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    freezeTableName: true
  }
);

Marca.hasMany(Producto, {foreignKey: 'marcaId'});
Producto.belongsTo(Marca, {foreignKey: 'marcaId'});