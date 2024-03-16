import { Router } from "express";
import { userModel } from "../dao/models/user.model.js";
import AuthMdw from "../middleware/auth.middleware.js";
import { createHash, isValidPassword } from "../middleware/encrypt.js"
import passport from "passport"


const sessionRoute = Router();

sessionRoute.get("/welcome", async (req, res) => {
    //welcome?name=luis
    const { name } = req.query;
    //console.log("🚀 ~ sessionRoute.get ~ name:", name);

    const counter = req.session?.counter;
    //console.log("🚀 ~ sessionRoute.get ~ counter:", counter);

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

sessionRoute.get(
    "/github",
    passport.authenticate("github", { scope: ["user:email"] }),
    async (req, res) => {}
  );
  
  sessionRoute.get("/github/callback", passport.authenticate("github", { failureRedirect: "/login" }),
    async (req, res) => {
      try {
        req.session.user = req.user;
        res.redirect("/profile");
      } catch (error) {
        console.log("🚀 ~ file: session.routes.js:115 ~ error:", error);
      }
    }
  );

sessionRoute.post("/login", async (req, res) => {
    const { Email, Password } = req.body;

    let role = "User"
    //if(Email === "adminCoder@coder.com" && Password === "adminCod3r123") {role = "Admin"}

    try {
        const session = req.session.user; 

        const findUser = await userModel.findOne({ email: Email });
        const isValid = await isValidPassword(Password,findUser.password);

        if (!findUser) return res.render("failregister", { message: "user not registered" });
        if (!isValid) return res.render("failregister", { message: "wrong password" });

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

    req.session.destroy((error) => {
        if (!error) return  res.redirect("/login");

        return res.send({ message: "logout trouble", body: error });
    });
});


sessionRoute.post("/register", async (req, res) => {
    try {

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

        const pswHashed = await createHash(Password)

        const addUser = {
            first_name: Nombre,
            last_name: Apellido,
            email: Email,
            password: pswHashed,
            phone: Telefono,
            address: Direccion,
            country: Pais,
            gender: Genero,
            age: Edad,
        };
        
       // console.log("🚀 ~ sessionRoute.post ~ addUser:", addUser)

        const exist = await userModel.findOne({ email: Email });
        if(exist) return res.render ("failregister", { status: "failed", message: "user already registered", })

        const newUser = await userModel.create(addUser);
        // console.log("🚀 ~ sessionRoute.post ~ addUser:", addUser)
        if (!newUser) return res.render("failregister", { message: "register failed" });

        req.session.user = { Nombre, Apellido, Email, Password };
        return res.redirect("/login");

    } catch (error) {
        return res.json({ status: "failed", message: error.message });
    }
});

export default sessionRoute;
