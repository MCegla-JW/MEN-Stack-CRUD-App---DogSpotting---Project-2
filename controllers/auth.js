import express from 'express'
import User from '../models/user.js'
import bcrypt from 'bcrypt'

const router = express.Router()

// * Routes 

// * GET - auth/sign-up - form render
router.get('/sign-up', (req, res) => {
    res.render('auth/sign-up.ejs')
})

// * POST - auth/sing-up - send info to database
router.post('/sign-up', async (req, res) => {
    try {
        const username = req.body.username 
        const email = req.body.email 
        const password = req.body.password 
        const confirmPassword = req.body.confirmPassword
        if (password !== confirmPassword) return res.status(422).send('Passwords do not match')
        const usernameInDatabase = await User.findOne({ username: username })
        if (usernameInDatabase) return res.status(422).send('Username already in use')
        const emailInDatabase = await User.findOne({ email: email})    
        if (emailInDatabase) return res.status(422).send('Email already in use')
        req.body.password = bcrypt.hashSync(password, 12)   
        const newUser = await User.create(req.body)
        res.redirect('/auth/sign-in')
        console.log('User created')
    } catch (error) {
        console.error(error)
        return res.status(500).send('Something went wrong. Please try again later.')
    }
})


// * GET - auth/sign-in -form render
router.get('/sign-in', (req, res) => {
    res.render('auth/sign-in.ejs')
})

// * POST - auth/sign-in 
router.post('/sign-in', async (req, res) => {
    try {
        const userToSignIn = await User.findOne({ username: req.body.username})
        if (!userToSignIn) return res.status(401).send('User does not exist')
        if (!bcrypt.compareSync(req.body.password, userToSignIn.password)) {
            return res.status(401).send('Invalid credentials')
        }
        console.log('REQ SESSION:', req.session)
        req.session.user = { 
            _id: userToSignIn._id,
            username: userToSignIn.username}
        res.redirect('/profile.ejs')
    } catch (error) {
        console.error('Something went wrong')
        return res.status(500).send('Something went wrong. Please try again later.')
    }
})

export default router 