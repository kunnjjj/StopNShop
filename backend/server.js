// const express = require('express')
// const ck = require('ckey');
import ck from 'ckey'
import express from 'express'
// import products from './data/products.js'
import connectDB from './config/db.js'
import colors from 'colors'
const app = express()
import productRoutes from './routes/productRoutes.js'
import {notFound,errorHandler} from './middleware/errorMiddleware.js'

connectDB()



// const products=require('./data/products')

// console.log(process.env)
///
app.get('/', (req, res) => {
    res.send('api running')
})

app.use('/api/products', productRoutes)

app.use(notFound)
app.use(errorHandler)


const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`server running in  mode ${process.env.NODE_ENV} on ${PORT}`)
})

