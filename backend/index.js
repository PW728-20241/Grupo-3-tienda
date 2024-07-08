import express from "express"
import cors from "cors"
import bodyParser from "body-parser";
import { sequelize } from "./database/database.js";
import { Usuario } from "./models/Usuario.js";
import { Orden } from "./models/Orden.js";
import { Producto } from "./models/Producto.js";
import { Orden_Producto } from "./models/Orden_Producto.js";
import { Serie } from "./models/Serie.js";
import { Marca } from "./models/Marca.js";
import { Tipo } from "./models/Tipo.js";

const app = express();
const port = process.env.PORT || 3080;

app.use(cors());
app.use(express.json());

app.use(bodyParser.urlencoded({ 
    extended: true
}));
/////////////CONEXION////////////////
async function verificarConexion() {
  try {
      await sequelize.authenticate();
      console.log("Conexion satisfactoria con la BD");
      await sequelize.sync({force: true});
  }
  catch(error) {
      console.error("No se puede conectar a la BD", error);
  }
}
app.listen(port, function() {
  console.log("Servidor escuchando en puerto " + port);
  verificarConexion();
});
/////////////USUARIOS////////////////
app.get("/", function(req, res) {
  return res.send("API de la tienda del abuelo");
});
app.get("/admin/usuarios/:id", async function(req, res) {
    const idUser = req.params.id;
    try {
      const usuario = await Usuario.findOne({
        where: { id: idUser },
        include: [
          {
            model: Orden,
            attributes: ["id", "fechaOrden", "cuentaTotal", "estado", "direccion", "metPago", "nroTarjeta" ,"envio"],
            include: [
              {
                model: Orden_Producto,
                include: [
                  {
                    model: Producto,
                    attributes: ["id","detalle", "precio", "fechaRegistro", "stock", "estado"]
                  }
                ]
              }
            ], order: [['id', 'ASC']]
          }
        ], order: [['id', 'ASC']]
      });
      res.status(200).json(usuario);
    } catch (error) {
      res.status(400).json({ error: "Error en la BD" });
    }
  });
app.get("/admin/usuarios", async function(req, res) {
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
                      attributes: ["id","detalle", "precio", "fechaRegistro", "stock", "estado"]
                    }
                  ],order: [['id', 'ASC']]
                }
              ],order: [['id', 'ASC']]
            }
          ],order: [['id', 'ASC']]
      });
      res.status(200).json(usuarios);
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
  });
  app.post("/admin/usuario", async function(req, res){
    try {    
        const data = req.body;
        const estadodefault = "Activo";
        if(data.nombre && data.apellido && data.correo && data.contrasena){
            const usuarioCreado = await Usuario.create({
                nombre: data.nombre,
                apellido: data.apellido,
                correo: data.correo,
                contrasena: data.contrasena,
                estado: estadodefault
            });
            res.status(201).json(usuarioCreado);
            console.log("Usuario creado");
        }else{
            res.status(400).json("Faltan datos");
        }
    }catch(error){
        console.error('Error al crear el usuario:', error.message);
        res.status(500).json({ error: 'Error en la BD', details: error.message });
    }
});
app.put("/admin/usuarios/:id", async function(req, res){
      const idUser = req.params.id;
      const data = req.body;
      try{
        const usuario = await Usuario.findOne({where: {id: idUser}});
        await usuario.update({
            nombre: data.nombre,
            apellido: data.apellido,
            correo: data.correo,
            contrasena: data.contrasena,
            fechaRegistro: data.fechaRegistro,
            estado: data.estado
        });
        res.status(201).json(usuario);
      }catch(error){
        res.status(400).json("Error en la BD");
      }
});
app.delete("/admin/usuarios/:id", async function(req, res){
      const idUser = req.params.id;
      try{
            await Usuario.destroy({where: {id: idUser}});
            res.send("Usuario eliminado");
      }catch(error){    
            res.status(400).send("Error en la BD");
      }      
});

app.post('/login', async (req, res) => {
  const { correo } = req.body;

  try {
    if (!correo) {
      return res.status(400).json({ message: 'Correo no proporcionado' });
    }

    console.log('Correo recibido:', correo);

    const usuario = await Usuario.findOne({ where: { correo } });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(usuario);
  } catch (error) {
    console.error('Error en el servidor:', error);
    res.status(500).json({ message: 'Error en el servidor', error });
  }
});

app.get('/usuarios/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const usuario = await Usuario.findByPk(userId);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(usuario);
  } catch (error) {
    console.error('Error en el servidor:', error);
    res.status(500).json({ message: 'Error en el servidor', error });
  }
});

app.put('/usuarios/:userId', async (req, res) => {
  const { userId } = req.params;
  const { nombre, apellido, correo, contrasena } = req.body;

  try {
    const usuario = await Usuario.findByPk(userId);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    usuario.nombre = nombre;
    usuario.apellido = apellido;
    usuario.correo = correo;
    usuario.contrasena = contrasena;
    await usuario.save();

    res.json(usuario);
  } catch (error) {
    console.error('Error en el servidor:', error);
    res.status(500).json({ message: 'Error en el servidor', error });
  }
});

app.get('/usuarios/:userId/ordenes', async (req, res) => {
  const { userId } = req.params;

  try {
    const usuario = await Usuario.findByPk(userId, {
      include: [{ model: Orden, include: [Producto] }]
    });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(usuario.Ordens);
  } catch (error) {
    console.error('Error en el servidor:', error);
    res.status(500).json({ message: 'Error en el servidor', error });
  }
});
app.post('/register', async (req, res) => {
  const { nombre, apellido, correo, contrasenia } = req.body;

  try {
    const nuevoUsuario = await Usuario.create({ nombre, apellido, correo, contrasenia });
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el usuario', error });
  }
});

app.post('/forgot-password', async (req, res) => {
  const { correo } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { correo } });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({ id: usuario.id, message: 'Correo de recuperación enviado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al procesar la solicitud', error });
  }
});

app.post('/login', async (req, res) => {
  const { correo, contrasenia } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { correo } });

    if (!usuario || usuario.contrasenia !== contrasenia) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }

    res.status(200).json({ id: usuario.id, nombre: usuario.nombre });
  } catch (error) {
    res.status(500).json({ message: 'Error al procesar la solicitud', error });
  }
});

app.get('/usuario/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los datos del usuario', error });
  }
});
/////////////ORDENES////////////////
app.get("/admin/ordenes/:id", async function(req, res){
   const idOrden = req.params.id;
   try{
       const orden = await Orden.findOne({where: {id: idOrden}});
       res.status(201).json(orden);
    }catch(error){
        res.status(400).json("Error en la BD");
    }
});
//prueba
app.get("/admin/ordenes", async function(req, res) {
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
                attributes: ["id","detalle", "precio", "fechaRegistro", "stock", "estado"]
              }
            ],order: [['id', 'ASC']]
          }
        ],order: [['id', 'ASC']]
      });
      res.status(200).json(ordenes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});
app.get("/admin/usuarios/:id/ordenes", async function(req, res){
    const idUser = req.params.id;
    try {
      const usuario = await Usuario.findOne({ where: { id: idUser } });
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      const ordenes = await usuario.getOrdens({order: [['id', 'ASC']]});
      res.json(ordenes);
    } catch (error) {
      console.error('Error al obtener las órdenes:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  app.post("/admin/usuarios/:id/orden", async function(req, res) {
    try {
      const data = req.body;
      const idUser = req.params.id;
      const cuenta = 0;
      const estadodefault = "En Proceso";
  
      const usuario = await Usuario.findByPk(idUser);
      if (!usuario) {
        console.log('Usuario no encontrado');
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      if (data.direccion && data.metPago && data.nroTarjeta && data.envio) {
        const ordenCreada = await Orden.create({
          cuentaTotal: cuenta,
          estado: estadodefault,
          direccion: data.direccion,
          metPago: data.metPago,
          nroTarjeta: data.nroTarjeta,
          envio: data.envio,
          usuarioId: idUser
        });
        await usuario.addOrden(ordenCreada);
        const result = await Orden.findOne({ 
          where: { id: ordenCreada.id },
          include: [{ model: Usuario, attributes: ["nombre", "apellido", "correo"]}]
        });
        return res.status(201).json(result);
      } else {
        console.log('Faltan datos en req.body:', data);
        return res.status(400).json("Faltan datos");
      }
    } catch (error) {
      console.error('Error al crear la orden y asociarla al usuario:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
app.put("/admin/ordenes/:id", async function(req, res) {
  const idOrden = req.params.id;
  const { productos, ...data } = req.body;
  try {
      const orden = await Orden.findOne({ where: { id: idOrden } });
      await orden.update(data);

      if (productos && productos.length > 0) {
          for (const productoId of productos) {
              const producto = await Producto.findByPk(productoId);
              if (producto) {
                  await Orden_Producto.create({ ordenId: orden.id, productoId: producto.id });
              }
          }
      }

      const ordenActualizada = await Orden.findOne({
          where: { id: idOrden },
          include: [
              {
                  model: Producto,
                  attributes: ["id","detalle", "precio", "fechaRegistro", "stock", "estado"],
              }
          ]
      });

      res.status(200).json(ordenActualizada);
  } catch (error) {
      console.error('Error al actualizar la orden:', error);
      res.status(500).json({ error: 'Error al actualizar la orden' });
  }
});


app.delete("/admin/ordenes/:id", async function(req, res){
      const idOrden = req.params.id;
      try{
            await Orden.destroy({where: {id: idOrden}});
            res.send("Orden eliminada");
      }catch(error){
            res.status(400).send("Error en la BD");
      }
});
/////////////PRODUCTOS////////////////
app.get("/admin/productos/:id", async function(req, res){
    const idProducto = req.params.id;
    try{
        const producto = await Producto.findOne({where: {id: idProducto}});
        res.status(201).json(producto);
    }catch(error){
        res.status(400).json("Error en la BD");
    }
});
app.get("/admin/productos", async function(req, res){
    const productos = await Producto.findAll({order: [['id', 'ASC']]});
    res.status(201).json(productos);
});
app.get("/admin/usuario/:idUser/orden/:idOrden/productos", async function(req, res) {
    const idUser = req.params.idUser;
    const idOrden = req.params.idOrden;
  
    try {
      const usuario = await Usuario.findOne({ where: { id: idUser } });
      if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
  
      const orden = await Orden.findOne({
        where: { id: idOrden, usuarioId: idUser },
        include: [
          {
            model: Producto,
            through: { attributes: [] }, // Esto asume que hay una tabla intermedia
            attributes: ["id","detalle", "precio", "fechaRegistro", "stock", "estado"],
            order: [['id', 'ASC']]
          }
        ], order: [['id', 'ASC']]
      });
  
      if (!orden) {
        return res.status(404).json({ error: "Orden no encontrada" });
      }
  
      res.json(orden.Productos);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }); 
app.post("/admin/productos", async function(req, res) {
  try {
      const { nombre, detalle, precio, fechaRegistro, stock, estado, imagen, } = req.body;
      const nuevoProducto = await Producto.create({
          nombre,
          detalle,
          precio,
          fechaRegistro: fechaRegistro || new Date(), // Asigna la fecha actual si no se proporciona
          stock,
          estado,
          imagen,
      });
      res.status(201).json(nuevoProducto);
  } catch (error) {
      console.error('Error al crear el producto:', error);
      res.status(500).json({ error: 'Error al crear el producto' });
  }
});
/////////////MARCAS////////////////
app.get("/admin/marcas", async function(req, res) {
  try {
      const marcas = await Marca.findAll({
          include: [
              {
                  model: Producto,
                  attributes: ["id", "nombre","detalle", "precio", "fechaRegistro", "stock", "estado"],
              }
          ]
      });
      res.status(200).json(marcas);
  } catch (error) {
      console.error('Error al obtener las marcas:', error);
      res.status(500).json({ error: 'Error al obtener las marcas' });
  }
});

app.get("/admin/marcas/:id", async function(req, res) {
  const idMarca = req.params.id;
  try {
      const marca = await Marca.findOne({
          where: { id: idMarca },
          include: [
              {
                  model: Producto,
                  attributes: ["id", "nombre","detalle", "precio", "fechaRegistro", "stock", "estado"],
              }
          ]
      });
      res.status(200).json(marca);
  } catch (error) {
      console.error('Error al obtener la marca:', error);
      res.status(500).json({ error: 'Error al obtener la marca' });
  }
});

app.post("/admin/marcas", async function(req, res) {
  try {
      const { nombre, descripcion, productos } = req.body;
      const nuevaMarca = await Marca.create({ nombre, descripcion });
      if (productos && productos.length > 0) {
          await nuevaMarca.addProductos(productos);
      }
      res.status(201).json(nuevaMarca);
  } catch (error) {
      console.error('Error al crear la marca:', error);
      res.status(500).json({ error: 'Error al crear la marca' });
  }
});

app.put("/admin/marcas/:id", async function(req, res) {
  const idMarca = req.params.id;
  try {
    const { nombre, descripcion, productos } = req.body;
    const marca = await Marca.findOne({ where: { id: idMarca } });
    await marca.update({ nombre, descripcion });

    if (productos && productos.length > 0) {
      for (const productoId of productos) {
        const producto = await Producto.findByPk(productoId);
        await marca.addProducto(producto);
      }
    }

    const marcaActualizada = await Marca.findOne({
      where: { id: idMarca },
      include: [
        {
          model: Producto,
          attributes: ["id", "nombre","detalle", "precio", "fechaRegistro", "stock", "estado"],
        }
      ]
    });

    res.status(200).json(marcaActualizada);
  } catch (error) {
      console.error('Error al actualizar la marca:', error);
      res.status(500).json({ error: 'Error al actualizar la marca' });
  }
});

/////////////TIPO////////////////
app.get("/admin/tipos", async function(req, res) {
  try {
      const tipos = await Tipo.findAll({
          include: [
              {
                  model: Producto,
                  attributes: ["id", "nombre","detalle", "precio", "fechaRegistro", "stock", "estado"],
              },
              {
                  model: Serie,
                  attributes: ["id","nombre","descripcion","fechaRegistro", "NroProductos"],
              }
          ]
      });
      res.status(200).json(tipos);
  } catch (error) {
      console.error('Error al obtener los tipos:', error);
      res.status(500).json({ error: 'Error al obtener los tipos' });
  }
});

app.get("/admin/tipos/:id", async function(req, res) {
  const idTipo = req.params.id;
  try {
      const tipo = await Tipo.findOne({
          where: { id: idTipo },
          include: [
              {
                  model: Producto,
                  attributes: ["id", "nombre","detalle", "precio", "fechaRegistro", "stock", "estado"],

                  model: Serie,
                  attributes: ["id","nombre","descripcion","fechaRegistro", "NroProductos"],
              }
          ]
      });
      res.status(200).json(tipo);
  } catch (error) {
      console.error('Error al obtener el tipo:', error);
      res.status(500).json({ error: 'Error al obtener el tipo' });
  }
});

app.post("/admin/tipos", async function(req, res) {
  try {
      const { nombre, descripcion, productos, series } = req.body;
      const nuevoTipo = await Tipo.create({ nombre, descripcion });
      if (productos && productos.length > 0) {
          await nuevoTipo.addProductos(productos);
      }
      if (series && series.length > 0) {
        await nuevoTipo.addSeries(series);
    }
      res.status(201).json(nuevoTipo);
  } catch (error) {
      console.error('Error al crear el tipo:', error);
      res.status(500).json({ error: 'Error al crear el tipo' });
  }
});

app.put("/admin/tipos/:id", async function(req, res) {
  const idTipo = req.params.id;
  try {
    const { nombre, descripcion, productos, series } = req.body;
    const tipo = await Marca.findOne({ where: { id: idTipo } });
    await tipo.update({ nombre, descripcion });

    if (productos && productos.length > 0) {
      for (const productoId of productos) {
        const producto = await Producto.findByPk(productoId);
        await tipo.addProducto(producto);
      }
    }

    if (series && series.length > 0) {
      for (const serieId of series) {
        const serie = await Serie.findByPk(serieId);
        await tipo.addSerie(serie);
      }
    }

    const tipoActualizado = await Tipo.findOne({
      where: { id: idTipo },
      include: [
        {
          model: Producto,
          attributes: ["id", "nombre","detalle", "precio", "fechaRegistro", "stock", "estado"],

          model: Serie,
          attributes: ["id", "nombre","detalle", "precio", "fechaRegistro", "stock", "estado"],
        }
      ]
    });

    res.status(200).json(tipoActualizado);
  } catch (error) {
      console.error('Error al actualizar el tipo:', error);
      res.status(500).json({ error: 'Error al actualizar el tipo' });
  }
});



/////////////SERIES////////////////
app.get("/admin/series", async function(req, res) {
  try {
      const series = await Serie.findAll({
          include: [
              {
                  model: Producto,
                  attributes: ["id", "nombre","detalle", "precio", "fechaRegistro", "stock", "estado"],
              }
          ]
      });
      res.status(200).json(series);
  } catch (error) {
      console.error('Error al obtener las series:', error);
      res.status(500).json({ error: 'Error al obtener las series' });
  }
});

app.get("/admin/series/:id", async function(req, res) {
  const idSerie = req.params.id;
  try {
      const serie = await Serie.findOne({
          where: { id: idSerie },
          include: [
              {
                  model: Producto,
                  attributes: ["id", "nombre","detalle", "precio", "fechaRegistro", "stock", "estado"],
              }
          ]
      });
      res.status(200).json(serie);
  } catch (error) {
      console.error('Error al obtener la serie:', error);
      res.status(500).json({ error: 'Error al obtener la serie' });
  }
});
//dev

app.post("/admin/series", async function(req, res) {
  try {
      const { nombre, descripcion, productos } = req.body;
      const nuevaSerie = await Serie.create({ nombre, descripcion });
      if (productos && productos.length > 0) {
          await nuevaSerie.addProductos(productos);
      }
      res.status(201).json(nuevaSerie);
  } catch (error) {
      console.error('Error al crear la serie:', error);
      res.status(500).json({ error: 'Error al crear la serie' });
  }
});

app.put("/admin/series/:id", async function(req, res) {
  const idSerie = req.params.id;
  try {
    const { nombre, descripcion, productos } = req.body;
    const serie = await Serie.findOne({ where: { id: idSerie } });
    await serie.update({ nombre, descripcion });

    if (productos && productos.length > 0) {
      for (const productoId of productos) {
        const producto = await Producto.findByPk(productoId);
        await serie.addProducto(producto);
      }
    }

    const serieActualizada = await Serie.findOne({
      where: { id: idSerie },
      include: [
        {
          model: Producto,
          attributes: ["id", "nombre","detalle", "precio", "fechaRegistro", "stock", "estado"],
        }
      ]
    });

    res.status(200).json(serieActualizada);
  } catch (error) {
      console.error('Error al actualizar la serie:', error);
      res.status(500).json({ error: 'Error al actualizar la serie' });
  }
});

app.delete("/admin/series/:id", async function(req, res) {
  const idSerie = req.params.id;
  try {
      await Serie.destroy({ where: { id: idSerie } });
      res.status(200).send("Serie eliminada");
  } catch (error) {
      console.error('Error al eliminar la serie:', error);
      res.status(500).json({ error: 'Error al eliminar la serie' });
  }
});

app.delete("/admin/series/:id/productos/:productoId", async function(req, res) {
  const idSerie = req.params.id;
  const productoId = req.params.productoId;
  try {
      const serie = await Serie.findByPk(idSerie);
      if (!serie) {
          return res.status(404).json({ error: 'Serie no encontrada' });
      }
      const producto = await Producto.findByPk(productoId);
      if (!producto) {
          return res.status(404).json({ error: 'Producto no encontrado' });
      }
      await serie.removeProducto(producto);
      res.status(200).send("Producto removido de la serie");
  } catch (error) {
      console.error('Error al remover el producto de la serie:', error);
      res.status(500).json({ error: 'Error al remover el producto de la serie' });
  }
});



app.delete("/admin/productos/:id", async function(req, res){
  const idProducto = req.params.id;
  try {
    await Producto.destroy({ where: { id: idProducto } });
    res.send("Producto eliminado");
  } catch (error) {
    res.status(400).send("Error en la BD");
  }
});
app.put("/admin/productos/:id", async function(req, res) {
  const idProducto = req.params.id;
  try {
    const { nombre, detalle, precio, fechaRegistro, stock, estado, imagen } = req.body;
    
    // Validar que precio y stock sean números
    const precioParsed = parseInt(precio, 10);
    const stockParsed = parseInt(stock, 10);

    if (isNaN(precioParsed) || isNaN(stockParsed)) {
      return res.status(400).send("Precio y Stock deben ser números válidos");
    }

    const producto = await Producto.findOne({ where: { id: idProducto } });
    if (producto) {
      await producto.update({
        nombre,
        detalle,
        precio: precioParsed,
        fechaRegistro,
        stock: stockParsed,
        estado,
        imagen
      });
      res.status(200).json(producto);
    } else {
      res.status(404).send("Producto no encontrado");
    }
  } catch (error) {
    res.status(400).send("Error en la BD");
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
////////////

app.post('/orden', async (req, res) => {
  const { shippingAddress, paymentMethod, creditCard, cartItems, total, shippingMethod, userId } = req.body;

  try {
    // Crear la orden
    const newOrder = await Orden.create({
      direccion: shippingAddress,
      metodoPago: paymentMethod,
      metodoEnvio: shippingMethod,
      total,
      estado: 'pendiente',
      usuarioId: userId
    });

    // Crear las relaciones de productos en la orden y reducir el stock
    for (const item of cartItems) {
      await OrderProduct.create({
        ordenId: newOrder.id,
        productoId: item.id,
        cantidad: item.cantidad
      });

      const producto = await Producto.findByPk(item.id);
      if (producto) {
        producto.stock -= item.cantidad;
        await producto.save();
      }
    }

    res.json(newOrder);
  } catch (error) {
    console.error('Error al crear la orden:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
app.get('/ordenes', async (req, res) => {
    const usuarioId = req.query.usuarioId;
  
    if (!usuarioId) {
      return res.status(400).json({ error: 'usuarioId es requerido' });
    }
  
    try {
      const ordenes = await Orden.findAll({
        where: {
          usuarioId: usuarioId
        }
      });
  
      res.json(ordenes);
    } catch (error) {
      console.error('Error al obtener las órdenes:', error);
      res.status(500).json({ error: 'Error al obtener las órdenes' });
    }
  });

/////////////FIN DE RUTAS////////////////

// Manejador de errores genérico
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Error interno del servidor');
});