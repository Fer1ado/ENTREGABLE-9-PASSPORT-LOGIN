import { promises as fs } from "fs"
import { _dirname } from "../../utils.js"
import Product from "./Product.js"

export default class ProductManager {
  constructor() {
    (this.products = []), 
    (this.ruta = `${_dirname}/Json/products.json`)
  }

    async addProduct(input) {
      console.log(input)
      //chequeo si todos los campos estan completos para agregar el producto
      const check = Object.values(input).some((valor) => valor === undefined)
      //transformo a objeto el archivo json para chequear por duplicados
      const producto = JSON.parse(await fs.readFile(this.ruta, "utf-8"))
      //chequeo si el producto no esta repetido
      const prod = producto.some((prod) => prod.code === input.code)
    
        try{
          
          if (check) {
            console.log("Producto Incompleto")
            return{status: "failed", msg: "PRODUCTO INCOMPLETO, FALTAN RELLENAR CAMPOS"}
          } if (prod) {
            console.log("Producto ya agregado")
            return{status: "failed", msg: "PRODUCTO YA AGREGADO"}
          } else {
            const newProduct = new Product(input.title, input.description, input.price, input.thumbnail, input.code, input.stock, input.status)
            console.log(newProduct)
            this.products.unshift(...producto, newProduct)
            await fs.writeFile(this.ruta, JSON.stringify(this.products))
            return{status: "success", msg: "Nuevo producto ingresado a la base de datos", product: newProduct}}
        } catch(err) {
          console.error("ERROR AL REALIZAR OPERACION", err.message)
        }
    }

    async getProducts(limit) {
      const producto = JSON.parse(await fs.readFile(this.ruta, "utf-8"))

        try{  
          if (!limit) {
            return producto
          } else {
              let respuesta = []
              for(let i=0; i< limit; i++){
              respuesta = respuesta.concat(producto[i])}
          return respuesta}
        } catch(err) {
        console.error("ERROR AL CONSULTAR LISTADO", err.mesaage)}
    }

    async getProductById(id) {
      const ID = parseInt(id)
      const producto = JSON.parse(await fs.readFile(this.ruta, "utf-8"))
      const produ = producto.find((prod) => prod.id === ID)
      
        try{
          if (produ) {
            console.log(`ENCONTRAMOS EL SIGUIENTE PRODUCTO CON ID: ${id}`)
            console.table(produ)
            return {status: "success", msg: "ENCONTRAMOS EL SIGUIENTE PRODUCTO EN LA BASE DE DATOS", product: produ}
          } else {
            console.error(`NO HAY PRODUCTOS CON ID ${id} EN LA BASE DE DATOS `)
            return{status: "failed", msg: "NO SE ENCONTRARON PRODUCTOS CON ESE ID EN LA BASE DE DATOS"}}
        } catch(err) {
        console.error("Error al intentar operación", err.message)
        }
    }
    

    async updateProduct(id, edicion) {
      const ID = parseInt(id)
      const producto = JSON.parse(await fs.readFile(this.ruta, "utf-8"))
      const index = producto.findIndex((prod) => {return prod.id === ID})

        try {
          if (index !== -1) {
            producto[index] = { ...producto[index], ...edicion }
            console.log(` EL PRODUCTO CON ID: ${id} FUE MODIFICADO `)
            console.log(producto[index])
            await fs.writeFile(this.ruta, JSON.stringify(producto))
            return {status: "success", msg: "PRODUCTO MODIFICADO CON EXITO", product: producto[index]}
            } else {
              return{status: "failed", msg: "NO SE ENCONTRARON PRODUCTOS CON ESE ID EN LA BASE DE DATOS"}}
        } catch(err) {
        console.error("Error al actualizar producto:", err.message)
        }
    }

    async deleteProduct(id) {
      const ID = parseInt(id)
      const producto = JSON.parse(await fs.readFile(this.ruta, "utf-8"))
      const produ = producto.find((prod) => prod.id === ID)

      try {
        if (produ) {
          console.log(`EL SIGUIENTE PRODUCTO HA SIDO ELIMINADO CON EXITO`)
          console.log(produ)
          await fs.writeFile( this.ruta, JSON.stringify(producto.filter((prod) => prod.id != id)))
          return {status: "success", msg: "PRODUCTO ELIMINADO CON EXITO", item: {produ} }
        } else {
          return {status: "failed", msg: "PRODUCTO NO ENCONTRADO" }}
      } catch(err) {
      console.error("Error al realizar la operacion", err.message)
      }
    }
}

const manager = new ProductManager()