
function AuthMdw(req, res, next) {
    if(req.session?.user || req.session?.admin){
        return next()
    }

    return res.status(401).json({message: "unauthorized acces"})

}

export default AuthMdw