import { Router } from "express";
import { MongoCartManager } from "../dao/db/cartManager.js"
import {productModel} from "../dao/models/product.model.js"
import { cartModel } from "../dao/models/cart.model.js";
import AuthMdw from "../middleware/auth.middleware.js";


const viewsRoute = Router()


viewsRoute.get("/home", async (req, res)=> {
  const products = await manager.getProducts()
  res.render("home", {
    js: "rtprod.js",
    css: "style.css",
  })
})

// Vista de Productos con Socket.io
viewsRoute.get("/realtimeproducts", (req, res) => {
    res.render ("realtimeproducts", {
      js:"rtprod.js",
      css:"style.css"
    } )
  })
  
  // Vista de Chat con Socket.io
  viewsRoute.get("/chat", async (req, res)=>{
    res.render("chat",{
      js: "chat.js",
      css: "chat.css"
    })
  })
  
  // vista de productos en handlebars con boton comprar
  viewsRoute.get("/products", AuthMdw, async (req, res) => {
    const { page = 1, limit = 20 , sort , filter = true} = req.query
    try {

    const sortTogle = (sort) =>{
      let srt = parseInt(sort)
      if(sort === undefined) return 1
      else { return srt *= -1 }
      }
  
      const sorting = sortTogle(sort)

      const response = await productModel.paginate({status: filter},{limit: limit, page: page, sort: {price: sorting}})

      if(page > response.totalPages){
        return res.json({status: "failed", message: "LA PAGINA SELECCIONADA NO EXISTE"})
      }
      
      const cart = await cartModel.create({})
     
      //Convierto la query de mongo a un objeto javascript plano para que lo pueda leer Handlebars
      const products = response.docs.map(doc =>  {return{
        id: doc._id,
        cart: cart._id,
        title: doc.title,
        description: doc.description,
        category: doc.category,
        thumbnail: doc.thumbnail,
        price: doc.price,
        stock: doc.stock,
        code: doc.code
      }})

      //paso el objeto plano al view de handlebars
      res.render("products", {
          docs: products,
          page: response.page,
          sort: sorting,
          nextPage: response.nextPage,
          prevPage: response.prevPage,
          totalPages: response.totalPages,
          hasPrevPage: response.hasPrevPage,
          hasNextPage: response.hasNextPage,
          prevLink: `?page=${response.prevPage}`,
          nextLink: `?page=${response.nextPage}`,
      })
      

    } catch (error) {
      return res.json({status: "failed", error: error.message})
    }
  });

//Vista de carrito interactiva con productos (probando que se podía hacer en handlebars, actualiza carrito cada vez que renderiza pagina)
  viewsRoute.post("/products/api/cart/:cid/product/:pid",AuthMdw, async (req, res) => {
    try {
      const pid = req.params.pid;
      const cid = req.params.cid
      const response = await MongoCartManager.addAndUpdateCart(cid,pid, 1)
      const cart = await cartModel.find({_id : cid}).populate("products.product",{title: 1, price: 1,stock:1, code: 1, description:1});
      
      //convierto ojbjeto mongoose a javascript plano
      const cartUp = cart[0].products.map(item => {
        return{
          id: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
          title: item.product.title,
          description: item.product.description,
          }
      })

      res.render("cart", {
        cart: cid,
        item: cartUp,
        deleteBtn: "btn btn-outline-primary disabled"
      })
      
    } catch (error) {
      return res.json({status: "failed", error: error.message})
    }
  })

//Vista de carrito con ruta GET como pide el desafio
  viewsRoute.get("/cart/:cid",AuthMdw, async (req, res) => {
    try {
      const cid = req.params.cid
      const cart = await cartModel.find({_id : cid}).populate("products.product",{title: 1, price: 1,stock:1, code: 1, description:1});

        //convierto ojbjeto mongoose a javascript plano
        const cartUp = cart[0].products.map(item => {
          return{
            id: item.product._id,
            quantity: item.quantity,
            price: item.product.price,
            title: item.product.title,
            description: item.product.description,
            }
        })
      
      res.render("cart", {
        cart: cid,
        item: cartUp,
      })

    } catch(error){
      return res.json({status: "failed", error: error.message})}
    }) 


    /* viewsRoute.get("/api/cookie", async (req, res) => {
      try {
        const cookie = req.cookies
        res.render("cookie", 
        {cookie})
      } catch (error) {
        return res.json({status: "failed", error: error.message})
      }
    }) */
    
    viewsRoute.get("/login",  async (req, res) => {
     res.render("login",{})
    })

    viewsRoute.get("/register", async (req, res) => {
     res.render("register",{})
    })

    // TODO: aca viene el middleware de autenticacion
    viewsRoute.get("/profile", AuthMdw, async (req, res) =>{
      const user = req.session.user

      res.render("profile",{
        user,
      })
    })
    
export default viewsRoute;

