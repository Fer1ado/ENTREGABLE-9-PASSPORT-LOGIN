import { productModel } from "../models/product.model.js";
import productData from "../../Json/init-products-data.js"

class ProductDAO {
   
    async getProducts(limit,page,query,sort) {
       
        return await productModel.find().limit(limit);
    }

    async getProductById(id) {
        try{
        const product = await productModel.findById({_id: id});
        return {status: "success", message:`encontramos el siguiente producto con con ID: ${id}`, product }
        } catch(err){
            return{status: "failed", message: err.message}
        }
        
    }

    async addMany() {
        try {
            const products = await productModel.insertMany(productData);
            return products
        } catch (err) {
            return {status: 'failed', message: err.message}
        }
    }


    async addProduct(productData) {
        try{
            const newProduct = await productModel.create(productData);
            return {status: "success", message:"producto creado con exito", newProduct  }
        }catch(err){
            return {status: 'failed', message: err.message}
        }
    }

    async updateProduct(id, updateData) {
        try{
        const edit = await productModel.findByIdAndUpdate(id, updateData, { new: true });
            return {status: "success", message:"producto editado con exito", edit  }
        }catch(err){
            return {status: "failed", message: err.message}
        }
    }

    async deleteProduct(id) {
        try{
            const erase = await productModel.findByIdAndDelete(id);
            return {status: "success", message:"producto eliminado con exito", erase  }        
        }catch(err){
            return {status: "failed", message: err.message}
        }
    }
}

export const MongoProductManager = new ProductDAO();