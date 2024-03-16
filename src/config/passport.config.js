import passport from "passport"
import local from "passport-local"
import GithubStrategy from "passport-github2"
import { userModel } from "../dao/models/user.model.js"

const localStrategy = local.Strategy

const initializePassport = () => {

        passport.use("register", new localStrategy({
            passReqToCallback: true, usernameField: "email"},

            async (req, username, password, done) =>{
                const {first_name, last_name, email, age} = req.body

                try {
                    let user = await userModel.findOne({ email: email})
                    console.log("🚀 ~ user:", user)
                   
                    if(user){
                        return done(null, false, {message: "Email already registered"})
                    }

                    const pswHashed = await createHash(password)
                    
                    const addUser = {
                        first_name,
                        last_name,
                        email,
                        password: pswHashed,
                    }

                    const newUser = await userModel.create(addUser)

                    if(!newUser){
                        return done(null, false,{status: "failed", message: "Problemas registrando el usuario"})
                    }

                    return done(null,newUser, {message: "Usuario registrado con éxito"})

                } catch (error) {
                    return done(`Error al buscar el usuario: ${error.message}`)
                }
            }))

        passport.use("login", new localStrategy({
            usernameField: "email",
        },
    async (username,password,done) =>{
        try {
            const user = userModel.findOne({email: username});

            if(!user){
                return done(null, false, {message: "Email not registered"})
            }
            //FALTA IMPPLEMENTAR EL HASH
            if(!isValidPassword(password, user.password)){
                return done(null, false, {message: "Password incorrecto"})
            }
            return done(null, user, {message: "Logueado con éxito"})

        } catch (error) {
            return done(null, false, {message: "Error al procesar el login"})
        }
            }) )

        passport.use("github", new GithubStrategy({
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: "http://localhost:8080/api/session/github/callback"
        },
        
        async (accessToken, refreshToken, profile, done) => {
            console.log("🚀 ~ file: passport.config.js:74 ~ profile:", profile);
            
            try {
                const user = await userModel.findOne({email: profile._json?.email})
                if(!user){
                    let addNewUser = {
                        Nombre: profile._json?.name,
                        Apellido: profile._json?.last_name,
                        Email: profile._json?.email,
                        Password: "",
                    }
                let newUser = await userModel.create(addNewUser);
                done(null, newUser);
                } else {
                    done(null, user)
                }}
            catch(error){
            console.log("🚀 ~ file: passport.config.js:91 ~ error:", error);
            done(error)
                }
            }
        )) 


        passport.serializeUser((user, done) => {
            done(null,user.id)
        })

        passport.deserializeUser(async (id, done) => {
            let user = await userModel.findById({_id: id})
            done(null,user)
        })

    }



export default initializePassport