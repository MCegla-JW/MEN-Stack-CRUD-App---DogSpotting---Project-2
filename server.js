import express from 'express'
import morgan from 'morgan'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import 'dotenv/config'
import methodOverride from 'method-override'

const app = express()

// * Middleware 
app.use(express.urlencoded()) // req.body
app.use(express.static('public')) // css
app.use(morgan('dev')) // morgan 
app.use(methodOverride('_method')) // override with POST having ?_method=DELETE


// * Routes
app.get('/', async (req, res) => {
    res.render('index.ejs')
})

app.listen(3000, () => console.log('🚀 Server working on port 3000'))