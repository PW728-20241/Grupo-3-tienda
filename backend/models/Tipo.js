import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Producto } from "./Producto.js";
import { Serie } from "./Serie.js";

export const Tipo = sequelize.define(
  "Tipo", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    freezeTableName: true
  }
);

Tipo.hasMany(Producto, {foreignKey: 'tipoId'});
Producto.belongsTo(Tipo, {foreignKey: 'tipoId'});
Tipo.hasMany(Serie, {foreignKey: 'tipoId'});
Serie.belongsTo(Tipo, {foreignKey: 'tipoId'});