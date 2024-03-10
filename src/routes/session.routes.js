import { Router } from "express";
import { userModel } from "../dao/models/user.model.js";
import AuthMdw from "../middleware/auth.middleware.js";


const sessionRoute = Router();

sessionRoute.get("/welcome", async (req, res) => {
    //welcome?name=luis
    const { name } = req.query;
    console.log("🚀 ~ sessionRoute.get ~ name:", name);

    const counter = req.session?.counter;
    console.log("🚀 ~ sessionRoute.get ~ counter:", counter);

    if (!counter) {
        req.session.counter = 1;
        req.session.user = name;
        req.session.admin = true;
        res.send(`Bienvenido ${name} administrador`);
    } else {
        req.session.counter++;
        req.session.user = name;
        req.session.admin = true;
        res.send(`Visita numero ${req.session.counter} de usuario ${name}`);
    }
});

sessionRoute.get("/login", async (req, res) => {
    const { Email, Password } = req.query;
    
    let role = "User"
    if(Email === "adminCoder@coder.com" && Password === "adminCod3r123") role = "Admin"

    try {
        const session = req.session.user; 
        const findUser = await userModel.findOne({ email: Email });

        if (!findUser) return res.json({ message: "user not registered" });
        if (findUser.password !== Password) return res.json({ message: "wrong password" });

        req.session.user = { ...findUser };

        return res.render("profile", {
            Nombre: req.session?.user?.first_name || findUser.first_name,
            Apellido: req.session?.user?.last_name || findUser.last_name,
            Email: req.session?.user?.email || Email,
            Edad: req.session?.user?.gae || findUser.age,
            Role: role
        })

    } catch (error) {
        return res.json({ status: "failed", message: error.message });
    }
});

sessionRoute.get("/logout",AuthMdw, async (req, res) => {
    const name = req.session;
    console.log("🚀 ~ sessionRoute.get ~ name:", name);

    req.session.destroy((error) => {
        if (!error) return  res.redirect("/login");

        return res.send({ message: "logout trouble", body: error });
    });
});


sessionRoute.post("/register", async (req, res) => {
    try {
        console.log("body register", req.body);
        const {
            Nombre,
            Apellido,
            Email,
            Password,
            Telefono,
            Direccion,
            Pais,
            Genero,
            Edad,
        } = req.body;

        const addUser = {
            first_name: Nombre,
            last_name: Apellido,
            email: Email,
            password: Password,
            phone: Telefono,
            address: Direccion,
            country: Pais,
            gender: Genero,
            age: Edad,
        };

        const exist = await userModel.findOne({ email: Email });
        if(exist) return res.json({ status: "failed", message: "user already registered", })

        const newUser = await userModel.create(addUser);
        if (!newUser) return res.json({ message: "register failed" });

        req.session.user = { Nombre, Apellido, Email, Password };
        return res.redirect("/login");
    } catch (error) {
        return res.json({ status: "failed", message: error.message });
    }
});

export default sessionRoute;
