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

// Función para verificar la conexión con la base de datos
async function verificarConexion() {
  try {
    await sequelize.authenticate();
    console.log("Conexión satisfactoria con la BD");
    await sequelize.sync({ force: true }); // Esto fuerza la sincronización con la BD al iniciar, ten cuidado con su uso en producción
  } catch (error) {
    console.error("No se puede conectar a la BD", error);
  }
}

// Escuchar en el puerto especificado y verificar la conexión
app.listen(port, function () {
  console.log("Servidor escuchando en puerto " + port);
  verificarConexion();
});

// Rutas para CRUD de usuarios
app.get("/admin/usuarios/:id", async function (req, res) {
  const idUser = req.params.id;
  try {
    const usuario = await Usuario.findOne({
      where: { id: idUser },
      include: [
        {
          model: Orden,
          attributes: [
            "id",
            "fechaOrden",
            "cuentaTotal",
            "estado",
            "direccion",
            "metPago",
            "nroTarjeta",
            "envio",
          ],
          include: [
            {
              model: Orden_Producto,
              include: [
                {
                  model: Producto,
                  attributes: [
                    "id",
                    "detalle",
                    "precio",
                    "fechaRegistro",
                    "stock",
                    "estado",
                  ],
                },
              ],
              order: [["id", "ASC"]],
            },
          ],
          order: [["id", "ASC"]],
        },
      ],
      order: [["id", "ASC"]],
    });
    res.status(200).json(usuario);
  } catch (error) {
    res.status(400).json({ error: "Error en la BD" });
  }
});

app.get("/admin/usuarios", async function (req, res) {
  try {
    const usuarios = await Usuario.findAll({
      include: [
        {
          model: Orden,
          attributes: [
            "id",
            "fechaOrden",
            "cuentaTotal",
            "estado",
            "direccion",
            "metPago",
            "nroTarjeta",
            "envio",
          ],
          include: [
            {
              model: Orden_Producto,
              include: [
                {
                  model: Producto,
                  attributes: [
                    "id",
                    "detalle",
                    "precio",
                    "fechaRegistro",
                    "stock",
                    "estado",
                  ],
                },
              ],
              order: [["id", "ASC"]],
            },
          ],
          order: [["id", "ASC"]],
        },
      ],
      order: [["id", "ASC"]],
    });
    res.status(200).json(usuarios);
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
});

app.post("/admin/usuario", async function (req, res) {
  try {
    const data = req.body;
    const estadodefault = "Activo";
    if (data.nombre && data.apellido && data.correo && data.contrasena) {
      const usuarioCreado = await Usuario.create({
        nombre: data.nombre,
        apellido: data.apellido,
        correo: data.correo,
        contrasena: data.contrasena,
        estado: estadodefault,
      });
      res.status(201).json(usuarioCreado);
      console.log("Usuario creado");
    } else {
      res.status(400).json("Faltan datos");
    }
  } catch (error) {
    console.error("Error al crear el usuario:", error.message);
    res.status(500).json({ error: "Error en la BD", details: error.message });
  }
});

app.put("/admin/usuarios/:id", async function (req, res) {
  const idUser = req.params.id;
  const data = req.body;
  try {
    const usuario = await Usuario.findOne({ where: { id: idUser } });
    await usuario.update({
      nombre: data.nombre,
      apellido: data.apellido,
      correo: data.correo,
      contrasena: data.contrasena,
      fechaRegistro: data.fechaRegistro,
      estado: data.estado,
    });
    res.status(201).json(usuario);
  } catch (error) {
    res.status(400).json("Error en la BD");
  }
});

app.delete("/admin/usuarios/:id", async function (req, res) {
  const idUser = req.params.id;
  try {
    await Usuario.destroy({ where: { id: idUser } });
    res.send("Usuario eliminado");
  } catch (error) {
    res.status(400).send("Error en la BD");
  }
});

// Rutas para CRUD de órdenes
app.get("/admin/ordenes/:id", async function (req, res) {
  const idOrden = req.params.id;
  try {
    const orden = await Orden.findOne({ where: { id: idOrden } });
    res.status(201).json(orden);
  } catch (error) {
    res.status(400).json("Error en la BD");
  }
});

app.get("/admin/ordenes", async function (req, res) {
  try {
    const ordenes = await Orden.findAll({
      include: [
        {
          model: Usuario,
          attributes: ["id", "nombre", "apellido", "correo"],
        },
        {
          model: Orden_Producto,
          include: [
            {
              model: Producto,
              attributes: [
                "id",
                "detalle",
                "precio",
                "fechaRegistro",
                "stock",
                "estado",
              ],
            },
          ],
          order: [["id", "ASC"]],
        },
      ],
      order: [["id", "ASC"]],
    });
    res.status(200).json(ordenes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/admin/usuarios/:id/ordenes", async function (req, res) {
  const idUser = req.params.id;
  try {
    const usuario = await Usuario.findOne({ where: { id: idUser } });
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    const ordenes = await usuario.getOrdens({ order: [["id", "ASC"]] });
    res.json(ordenes);
  } catch (error) {
    console.error("Error al obtener las órdenes:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.post("/admin/usuarios/:id/orden", async function (req, res) {
  try {
    const data = req.body;
    const idUser = req.params.id;
    const cuenta = 0;
    const estadodefault = "En Proceso";

    const usuario = await Usuario.findByPk(idUser);
    if (!usuario) {
      console.log("Usuario no encontrado");
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    if (data.direccion && data.metPago && data.nroTarjeta && data.envio) {
      const ordenCreada = await Orden.create({
        cuentaTotal: cuenta,
        estado: estadodefault,
        direccion: data.direccion,
        metPago: data.metPago,
        nroTarjeta: data.nroTarjeta,
        envio: data.envio,
        usuarioId: idUser,
      });
      await usuario.addOrden(ordenCreada);
      const result = await Orden.findOne({
        where: { id: ordenCreada.id },
        include: [{ model: Usuario, attributes: ["nombre", "apellido", "correo"] }],
      });
      return res.status(201).json(result);
    } else {
      console.log("Faltan datos en req.body:", data);
      return res.status(400).json("Faltan datos");
    }
  } catch (error) {
    console.error("Error al crear la orden y asociarla al usuario:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.put("/admin/ordenes/:id", async function (req, res) {
  const idOrden = req.params.id;
  const { productos, ...data } = req.body;
  try {
    const orden = await Orden.findOne({ where: { id: idOrden } });
    await orden.update(data);

    if (productos && productos.length > 0) {
      for (const productoId of productos) {
        const producto = await Producto.findByPk(productoId);
        if (producto) {
          await orden.addProducto(producto);
        }
      }
    }

    const ordenActualizada = await Orden.findOne({
      where: { id: idOrden },
      include: [{ model: Producto, attributes: ["id", "detalle", "precio"] }],
    });

    res.status(200).json(ordenActualizada);
  } catch (error) {
    console.error("Error al actualizar la orden:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.delete("/admin/ordenes/:id", async function (req, res) {
  const idOrden = req.params.id;
  try {
    await Orden.destroy({ where: { id: idOrden } });
    res.send("Orden eliminada");
  } catch (error) {
    res.status(400).send("Error en la BD");
  }
});

// Rutas para CRUD de productos
app.get("/admin/productos/:id", async function (req, res) {
  const idProducto = req.params.id;
  try {
    const producto = await Producto.findOne({ where: { id: idProducto } });
    res.status(200).json(producto);
  } catch (error) {
    res.status(400).json("Error en la BD");
  }
});

app.get("/admin/productos", async function (req, res) {
  try {
    const productos = await Producto.findAll();
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/admin/producto", async function (req, res) {
  try {
    const data = req.body;
    if (data.detalle && data.precio && data.fechaRegistro && data.stock && data.estado) {
      const productoCreado = await Producto.create({
        detalle: data.detalle,
        precio: data.precio,
        fechaRegistro: data.fechaRegistro,
        stock: data.stock,
        estado: data.estado,
      });
      res.status(201).json(productoCreado);
    } else {
      res.status(400).json("Faltan datos");
    }
  } catch (error) {
    console.error("Error al crear el producto:", error.message);
    res.status(500).json({ error: "Error en la BD", details: error.message });
  }
});

app.put("/admin/productos/:id", async function (req, res) {
  const idProducto = req.params.id;
  const data = req.body;
  try {
    const producto = await Producto.findOne({ where: { id: idProducto } });
    await producto.update({
      detalle: data.detalle,
      precio: data.precio,
      fechaRegistro: data.fechaRegistro,
      stock: data.stock,
      estado: data.estado,
    });
    res.status(200).json(producto);
  } catch (error) {
    res.status(400).json("Error en la BD");
  }
});

app.delete("/admin/productos/:id", async function (req, res) {
  const idProducto = req.params.id;
  try {
    await Producto.destroy({ where: { id: idProducto } });
    res.send("Producto eliminado");
  } catch (error) {
    res.status(400).send("Error en la BD");
  }
});

// Ruta de prueba para verificar que el servidor está en línea
app.get("/", async function (req, res) {
  res.send("Servidor en línea");
});