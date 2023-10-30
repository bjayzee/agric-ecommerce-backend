const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');



const encryptPassword = async(password) =>{
    const salt = await bcrypt.genSalt();
    return bcrypt.hashSync(password, salt);
}


const decryptPassword = async (reqPassword, password) => {
    return bcrypt.compareSync(reqPassword, password);
}

const generateToken = (id, role) => {
    jwt.sign(
    {
        user_id: id,
        role: role
    },
    process.env.SECRET,
        { expiresIn: process.env.JWT_EXPIRATION_TIME }
)}

const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.SECRET);
    } catch (err) {
        return err;
    }
}

module.exports = {
    verifyToken,
    generateToken,
    encryptPassword,
    decryptPassword
}