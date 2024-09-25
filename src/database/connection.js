const { Sequelize } = require("sequelize")
const dbConfig = require('../config/configDatabase')

const UserModel = require("../models/user")

const connection = new Sequelize(dbConfig)

UserModel.init(connection)

connection.authenticate().then( () =>{
  console.log("banco de dados conectado")
})
.catch( (error) =>{
  console.error(`erro ${error}`)
})

  module.exports = connection