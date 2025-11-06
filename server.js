import express from 'express'
import morgan from 'morgan'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import 'dotenv/config'
import methodOverride from 'method-override'
import MongoStore from 'connect-mongo'
import session from 'express-session' // used for signing in user 
import passUserToView from './middleware/pass-user-to-view.js'
import passErrorToView from './middleware/pass-error-to-view.js'
import passMessageToView from './middleware/pass-message-to-view.js'

// * Controllers / Routers 
import authController from './controllers/auth.js'
import dogController from './controllers/dogs.js'

const app = express()

// * Middleware 
app.use(express.urlencoded()) // req.body
app.use(express.static('public')) // css
app.use(morgan('dev')) // morgan 
app.use(methodOverride('_method')) // override with POST having ?_method=DELETE
app.use(session({ // req.session
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI })
}))
app.use(passUserToView, passErrorToView, passMessageToView)

app.use((req, res, next) => {
    console.log(req.session)
    next()
})

// * Routes
app.get('/', async (req, res) => {
    try {
        if (req.session.user) {
            return res.redirect('/auth/profile')
        }
        res.render('index.ejs')
    } catch (error) {
        console.error('Something went wrong')
    }
})

app.use('/auth', authController)
app.use('/dogs', dogController)

// * Connections 

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('🔒 Database connection established')
    } catch (error) {
        console.log('Something went wrong')
    }
}
connect()


app.listen(3000, () => console.log('🚀 Server working on port 3000'))