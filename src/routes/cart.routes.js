import { Router } from "express";
import CartManager from "../dao/filesystem/cartManager.js"
import { MongoCartManager } from "../dao/db/cartManager.js";

const cartRoute = Router();
const carro = new CartManager()

cartRoute.get("/:cid", async(req, res)=>{
    const cid = req.params.cid
    res.send(await MongoCartManager.getCarrito(cid))
})

cartRoute.get("/", async(req, res)=>{
    const cid = req.params.cid
    res.send(await MongoCartManager.findAll(cid))
})

cartRoute.post("/",async (req, res) => {
    const cart = res.send(await MongoCartManager.createCart());
})


cartRoute.post("/:cid/product/:pid",async (req, res) => {
    const pid = req.params.pid;
    const cid = req.params.cid
    const quantity = req.body.quantity;
    res.send(await MongoCartManager.addAndUpdateCart(cid,pid, quantity));
   
})

cartRoute.put("/:cid/product/:pid",async (req, res) => {
    const pid = req.params.pid;
    const cid = req.params.cid
    const quantity = req.body.quantity;
    res.send(await MongoCartManager.addAndUpdateCart(cid,pid, quantity));
})

cartRoute.delete("/:cid/product/:pid",async (req, res) => {
    const pid = req.params.pid;
    const cid = req.params.cid
    const quantity = req.body.quantity;
    res.send(await MongoCartManager.deleteProductById(cid,pid, quantity));
})

cartRoute.put("/:cid",async (req, res) => {
    const cid = req.params.cid
    const array = req.body;
    res.send(await MongoCartManager.updateCartWithProducts(cid,array));
})


cartRoute.delete("/:cid", async(req, res)=>{
    const cid = req.params.cid
    res.send(await MongoCartManager.deleteCart(cid))
})


export default cartRoute