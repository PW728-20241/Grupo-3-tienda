import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { sequelize } from "./database/database.js";
import { Usuario } from "./models/Usuario.js";
import { Orden } from "./models/Orden.js";
import { Producto } from "./models/Producto.js";
import { Orden_Producto } from "./models/Orden_Producto.js";
import { Serie } from "./models/Serie.js";

const app = express();
const port = process.env.PORT || 3080;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

/////////////CONEXION////////////////
async function verificarConexion() {
  try {
    await sequelize.authenticate();
    console.log("Conexión satisfactoria con la base de datos");
    await sequelize.sync({ force: true }); // Sincronizar modelos con la base de datos
  } catch (error) {
    console.error("No se puede conectar a la base de datos:", error);
  }
}

app.listen(port, () => {
  console.log(`Servidor escuchando en puerto ${port}`);
  verificarConexion();
});

/////////////USUARIOS////////////////
// Obtener todos los usuarios
app.get("/admin/usuarios", async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      include: [
        {
          model: Orden,
          attributes: ["id", "fechaOrden", "cuentaTotal", "estado", "direccion", "metPago", "nroTarjeta", "envio"],
          include: [
            {
              model: Orden_Producto,
              include: [
                {
                  model: Producto,
                  attributes: ["id", "nombre", "precio", "fechaRegistro", "stock", "estado"]
                }
              ]
            }
          ]
        }
      ]
    });
    res.status(200).json(usuarios);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});

// Obtener un usuario por ID
app.get("/admin/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await Usuario.findByPk(id, {
      include: [
        {
          model: Orden,
          attributes: ["id", "fechaOrden", "cuentaTotal", "estado", "direccion", "metPago", "nroTarjeta", "envio"],
          include: [
            {
              model: Orden_Producto,
              include: [
                {
                  model: Producto,
                  attributes: ["id", "nombre", "precio", "fechaRegistro", "stock", "estado"]
                }
              ]
            }
          ]
        }
      ]
    });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(200).json(usuario);
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
});

// Crear un usuario
app.post("/admin/usuarios", async (req, res) => {
  const { nombre, apellido, correo, contrasena } = req.body;
  try {
    const usuario = await Usuario.create({
      nombre,
      apellido,
      correo,
      contrasena,
      estado: "Activo"
    });
    res.status(201).json(usuario);
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
});

// Actualizar un usuario por ID
app.put("/admin/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, correo, contrasena, estado } = req.body;
  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    await usuario.update({
      nombre,
      apellido,
      correo,
      contrasena,
      estado
    });
    res.status(200).json(usuario);
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
});

// Eliminar un usuario por ID
app.delete("/admin/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    await usuario.destroy();
    res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
});

/////////////ORDENES////////////////
// Obtener todas las órdenes
app.get("/admin/ordenes", async (req, res) => {
  try {
    const ordenes = await Orden.findAll({
      include: [
        {
          model: Usuario,
          attributes: ["id", "nombre", "apellido", "correo"]
        },
        {
          model: Orden_Producto,
          include: [
            {
              model: Producto,
              attributes: ["id", "nombre", "precio", "fechaRegistro", "stock", "estado"]
            }
          ]
        }
      ]
    });
    res.status(200).json(ordenes);
  } catch (error) {
    console.error('Error al obtener las órdenes:', error);
    res.status(500).json({ error: 'Error al obtener las órdenes' });
  }
});

// Obtener una orden por ID
app.get("/admin/ordenes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const orden = await Orden.findByPk(id, {
      include: [
        {
          model: Usuario,
          attributes: ["id", "nombre", "apellido", "correo"]
        },
        {
          model: Orden_Producto,
          include: [
            {
              model: Producto,
              attributes: ["id", "nombre", "precio", "fechaRegistro", "stock", "estado"]
            }
          ]
        }
      ]
    });
    if (!orden) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }
    res.status(200).json(orden);
  } catch (error) {
    console.error('Error al obtener la orden:', error);
    res.status(500).json({ error: 'Error al obtener la orden' });
  }
});

// Crear una orden para un usuario específico
app.post("/admin/usuarios/:id/ordenes", async (req, res) => {
  const { id } = req.params;
  const { cuentaTotal, estado, direccion, metPago, nroTarjeta, envio, productos } = req.body;
  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const orden = await Orden.create({
      cuentaTotal,
      estado,
      direccion,
      metPago,
      nroTarjeta,
      envio,
      usuarioId: id
    });
    if (productos && productos.length > 0) {
      await Promise.all(productos.map(async (productoId) => {
        const producto = await Producto.findByPk(productoId);
        if (producto) {
          await Orden_Producto.create({ ordenId: orden.id, productoId });
        }
      }));
    }
    res.status(201).json(orden);
  } catch (error) {
    console.error('Error al crear la orden:', error);
    res.status(500).json({ error: 'Error al crear la orden' });
  }
});

// Actualizar una orden por ID
app.put("/admin/ordenes/:id", async (req, res) => {
  const { id } = req.params;
  const { cuentaTotal, estado, direccion, metPago, nroTarjeta, envio, productos } = req.body;
  try {
    const orden = await Orden.findByPk(id);
    if (!orden) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }
    await orden.update({
      cuentaTotal,
      estado,
      direccion,
      metPago,
      nroTarjeta,
      envio
    });
    await Orden_Producto.destroy({ where: { ordenId: orden.id } });
    if (productos && productos.length > 0) {
      await Promise.all(productos.map(async (productoId) => {
        const producto = await Producto.findByPk(productoId);
        if (producto) {
          await Orden_Producto.create({ ordenId: orden.id, productoId });
        }
      }));
    }
    res.status(200).json(orden);
  } catch (error) {
    console.error('Error al actualizar la orden:', error);
    res.status(500).json({ error: 'Error al actualizar la orden' });
  }
});

// Eliminar una orden por ID
app.delete("/admin/ordenes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const orden = await Orden.findByPk(id);
    if (!orden) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }
    await Orden_Producto.destroy({ where: { ordenId: orden.id } });
    await orden.destroy();
    res.status(200).json({ message: 'Orden eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar la orden:', error);
    res.status(500).json({ error: 'Error al eliminar la orden' });
  }
});

/////////////PRODUCTOS////////////////
// Obtener todos los productos
app.get("/admin/productos", async (req, res) => {
  try {
    const productos = await Producto.findAll();
    res.status(200).json(productos);
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

// Obtener un producto por ID
app.get("/admin/productos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json(producto);
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

// Crear un producto
app.post("/admin/productos", async (req, res) => {
  const { nombre, precio, fechaRegistro, stock, estado } = req.body;
  try {
    const producto = await Producto.create({
      nombre,
      precio,
      fechaRegistro,
      stock,
      estado
    });
    res.status(201).json(producto);
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
});

// Actualizar un producto por ID
app.put("/admin/productos/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, precio, fechaRegistro, stock, estado } = req.body;
  try {
    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    await producto.update({
      nombre,
      precio,
      fechaRegistro,
      stock,
      estado
    });
    res.status(200).json(producto);
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

// Eliminar un producto por ID
app.delete("/admin/productos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    await producto.destroy();
    res.status(200).json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

/////////////SERIES////////////////
// Obtener todas las series
app.get("/admin/series", async (req, res) => {
  try {
    const series = await Serie.findAll();
    res.status(200).json(series);
  } catch (error) {
    console.error('Error al obtener las series:', error);
    res.status(500).json({ error: 'Error al obtener las series' });
  }
});

// Obtener una serie por ID
app.get("/admin/series/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const serie = await Serie.findByPk(id);
    if (!serie) {
      return res.status(404).json({ error: 'Serie no encontrada' });
    }
    res.status(200).json(serie);
  } catch (error) {
    console.error('Error al obtener la serie:', error);
    res.status(500).json({ error: 'Error al obtener la serie' });
  }
});

// Crear una serie
app.post("/admin/series", async (req, res) => {
  const { nombre, descripcion, fechaInicio, fechaFin, estado } = req.body;
  try {
    const serie = await Serie.create({
      nombre,
      descripcion,
      fechaInicio,
      fechaFin,
      estado
    });
    res.status(201).json(serie);
  } catch (error) {
    console.error('Error al crear la serie:', error);
    res.status(500).json({ error: 'Error al crear la serie' });
  }
});

// Actualizar una serie por ID
app.put("/admin/series/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, fechaInicio, fechaFin, estado } = req.body;
  try {
    const serie = await Serie.findByPk(id);
    if (!serie) {
      return res.status(404).json({ error: 'Serie no encontrada' });
    }
    await serie.update({
      nombre,
      descripcion,
      fechaInicio,
      fechaFin,
      estado
    });
    res.status(200).json(serie);
  } catch (error) {
    console.error('Error al actualizar la serie:', error);
    res.status(500).json({ error: 'Error al actualizar la serie' });
  }
});

// Eliminar una serie por ID
app.delete("/admin/series/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const serie = await Serie.findByPk(id);
    if (!serie) {
      return res.status(404).json({ error: 'Serie no encontrada' });
    }
    await serie.destroy();
    res.status(200).json({ message: 'Serie eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar la serie:', error);
    res.status(500).json({ error: 'Error al eliminar la serie' });
  }
});

/////////////PRODUCTO PARA CHECKOUT////////////////
// Obtener un producto específico para el checkout por ID
app.get("/admin/productos/:id/checkout", async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await Producto.findByPk(id, {
      attributes: ["id", "nombre", "precio"] // Ajusta las propiedades según tus necesidades
    });
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json(producto);
  } catch (error) {
    console.error('Error al obtener el producto para el checkout:', error);
    res.status(500).json({ error: 'Error al obtener el producto para el checkout' });
  }
});

/////////////FIN DE RUTAS////////////////

// Manejador de errores genérico
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Error interno del servidor');
});