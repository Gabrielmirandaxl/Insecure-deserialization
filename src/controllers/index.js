const UserModel = require('../models/user')
const bcrypt = require("bcrypt")
var serialize = require('node-serialize');

async function welcome(req,res){
    try {

        const token = req.headers.authorization
        const {name} = serialize.unserialize(Buffer.from(token, 'base64').toString('utf-8'))

        if(!token){
            return res.status(401).json(401)
        }
        
        const tokenValidate = await verifyToken(token)

        if(!tokenValidate){
            return res.status(401).json(401)
        }

        return res.status(200).send(`Seja muito bem vindo, ${name}`)
    } catch (error) {
        return res.status(500).json({"msg": "error in server"})
    }
}

function generateCookie(user){

    const profile = {
        id: user.id,
        name: user.name,
        email: user.email
    }

    return Buffer.from(serialize.serialize(profile)).toString('base64'); 
}

async function register(req,res){
    try {
        const {name, email, senha} = req.body

        const emailExists = await verifyUser(email)

        if(emailExists){
            return res.status(200).json("Utilize outro email!")
        }

        const hashedPassword =  await bcrypt.hash(senha, 10);

        const user = await UserModel.create({name,email,senha: hashedPassword})

        if(!user){
            return res.status(500).json("Erro ao cadastrar os usuários")
        }

        return res.status(200).json("Usuário cadastrado com sucesso!")
        
    } catch (error) {
        return res.status(500).json({"msg": "error in server"})
    }
}

async function login(req,res){
    try {
        const {email, senha} = req.body

        const user = await verifyUser(email)

        if(!user || !(await bcrypt.compare(senha, user.senha))){
            return res.status(200).json({"msg": "usuário ou senha incorretos"})
        }

        return res.status(200).json(generateCookie(user))
        
    } catch (error) {
        return res.status(500).json({"msg": "error in server"})
    }
}

async function verifyUser(email) {
    try {
        return await UserModel.findOne({ where: { email: email } });
    } catch (error) {
        return res.status(500).json({"msg": "error in server"})
    }
}


async function verifyToken(token){
    try {
        const {id} = serialize.unserialize(Buffer.from(token, 'base64').toString('utf-8'))
        
       return await UserModel.findOne({ where: { id: id } })
    } catch (error) {
        return res.status(500).json({"msg": "error in server"})
    }
}

module.exports = {
    welcome,
    register,
    login
}
