import bcrypt from 'bcrypt';


const createHash = async(psw) =>{
    const salt = await bcrypt.genSalt(15);
    console.log(salt);
    return await bcrypt.hashSync(psw, salt)
    
}

const isValidPassword = async(psw, encryptedPsw) =>{
    const isValid = await bcrypt.compareSync(psw, encryptedPsw)
    return isValid
}

export {createHash, isValidPassword}
