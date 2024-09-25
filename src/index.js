const express = require('express')
const cors = require('cors');
const router = require("../src/routes/index")
require("../src/database/connection")

const app = express()


//JSON
app.use(express.json())

//CORS
app.use(cors({
    origin: 'http://127.0.0.1:3030/'
}));

//Method POST
app.use(express.urlencoded({extended: true}))

//Routers
app.use('/', router)

app.listen(3000, () => {
    console.log("Server listening 3000")
})