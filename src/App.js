import 'dotenv/config'
import mongoose from 'mongoose';
import handlebars from "express-handlebars";
import passport from 'passport';
import path from "path"
import {Server} from "socket.io"
import displayRoutes from 'express-routemap';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import mongoStore from 'connect-mongo';
import initializePassport from "./config/passport.config.js"


//importación de rutas persistencia archivos locales
import cartRoute from "./routes/cart.routes.js";
import prodRoute from "./routes/products.routes.js";
import viewsRoute from "./routes/views.routes.js";
import sessionRoute from './routes/session.routes.js';
import ProductManager from "./dao/filesystem/productManager.js";


//importacion rutas de persistencia MongogoDB
import { MongoProductManager } from './dao/db/productManager.js';
import { MongoMessageManager } from './dao/db/messageManager.js';


/// CONFIG/IMPORT SERVIDOR
import express from "express";
import { _dirname } from "./utils.js";

const app = express()
const PORT = 8080;

const DB_HOST = "localhost";
const DB_PORT = 27017;
const DB_NAME = "OnLineStore"

const MongoConect = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`


/// CONEXION A MONGO DB
mongoose.connect(process.env.DB_CNN)
    .then(() => console.log('Conectado a Mongo Exitosamente'))
    .catch(() => console.log('Error al conectarse a la base de datos'))

const HASH_KOOKIE = "pepepepe"

// MIDDLEWARE - configs
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(HASH_KOOKIE)) 
app.use(session({
  store: mongoStore.create({
      mongoUrl: process.env.DB_CNN,
      mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},
      ttl: 60 * 3500,
    }),
    secret: HASH_KOOKIE,
    resave: false,
    saveUninitialized: false,
  })
)
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

// RUTAS ESTATICAS PARA VIEWS
app.use("/static", express.static(_dirname + "/public"))
app.use("/products", express.static(_dirname + "/public"))
app.use('/realtimeproducts', express.static(path.join(_dirname, '/public')))
app.use('/home', express.static(path.join(_dirname, '/public')))
app.use('/chat', express.static(path.join(_dirname, '/public')))


// SETEO DE PUERTO
const httpserver = app.listen(PORT, ()=>{
  displayRoutes(app)
  console.log(`Server listening on port ${PORT}`)
})


//IMPLEMENTACION SOCKET IO
const io = new Server(httpserver)

const allMesages = []
io.on('connection', (socket)=> {
  console.log('servidor de socket io conectado')
  // socket de realtimeproducts
  socket.on('nuevoProducto', async (nuevoProd) => {
      const {title, description,category, thumbnail, price, stock, code} = nuevoProd
      const response = await MongoProductManager.addProduct({title: title, description: description, price: price, category: category, thumbnail: thumbnail, price: price, stock: stock, code: code})
      console.log(response)
      const products = await MongoProductManager.getProducts()
      socket.emit('products-data', products)
      socket.emit("status-changed", response)
  })

  socket.on('update-products', async () => {
      const products = await MongoProductManager.getProducts();
      socket.emit('products-data', products);
  });

  socket.on('remove-product', async (prodID) => {
      console.log("inicio remove socket")
      const result = await MongoProductManager.deleteProduct(prodID) 
      socket.emit("status-changed", result)
      const products = await MongoProductManager.getProducts()
      socket.emit('products-data', products)
      console.log("fin remove socket")
  })

  //socket del chat
  socket.emit("msg-logs", async()=>{
    const messages = await MongoMessageManager.findAll()
    socket.emit('msg-logs', messages)
  })

  socket.on("nuevo-usuario",(data)=>{
    socket.broadcast.emit("nuevo-usuario", data)
  })

  socket.on("new-msg", async (data)=>{
    let now = new Date().getTime()
    const msg = {user: data.user, message: data.message}
    await MongoMessageManager.create({user: data.user, message: data.message, timeStamp: now})
    const messages = await MongoMessageManager.findAll()
    io.emit("msg-logs", messages)
  })

})

// CONFIG HANDLEBARS
app.engine("handlebars", handlebars.engine())
app.set("views", path.resolve(_dirname, "./views"))
app.set("view engine", "handlebars")


//ROUTES
app.use("/api/products", prodRoute);
app.use("/api/cart", cartRoute)
app.use("/", viewsRoute);
app.use("/api/session", sessionRoute);

const manager = new ProductManager()