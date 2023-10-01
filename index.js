const express = require("express")
const app= express()
var cors = require('cors')

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors())

const authRouter = require('./routes/auth.router')
const orderRouter = require('./routes/order.router')
const boostRouter = require('./routes/boost.router')

app.use("/auth", authRouter)
app.use("/order", orderRouter)
app.use("/boost", boostRouter)


const PORT = 3333

app.listen(PORT, () => {
    console.log("Server is running....")
})