import express from 'express'
import User from '../models/user.js'
import bcrypt from 'bcrypt'
import isSignedIn from '../middleware/is-signed-in.js'
import isSignedOut from '../middleware/is-signed-out.js'
import passUserToView from '../middleware/pass-user-to-view.js'

const router = express.Router()

// * Routes 

// * GET - auth/sign-up - form render
router.get('/sign-up', isSignedOut, (req, res) => {
    res.render('auth/sign-up.ejs', { error: null })
})

// * POST - auth/sing-up - send info to database
router.post('/sign-up', async (req, res) => {
    try {
        const username = req.body.username
        const email = req.body.email
        const password = req.body.password
        const confirmPassword = req.body.confirmPassword
        if (password !== confirmPassword) throw new Error('Passwords do not match. Try again.')
        const usernameInDatabase = await User.findOne({ username: username })
        if (usernameInDatabase) throw new Error(`Username "${username}" already taken. Try a new one.`)
        const emailInDatabase = await User.findOne({ email: email })
        if (emailInDatabase) throw new Error(`Email "${email}" already in use. Try a new one.`)
        req.body.password = bcrypt.hashSync(password, 12)
        const newUser = await User.create(req.body)
        res.redirect('/auth/sign-in')
        console.log('User created')
    } catch (error) {
        console.log(error.message)
        res.render('auth/sign-up.ejs', { error: error.message })
    }
})


// * GET - auth/sign-in -form render
router.get('/sign-in', isSignedOut, (req, res) => {
    res.render('auth/sign-in.ejs')
})

// * POST - auth/sign-in 
router.post('/sign-in', async (req, res) => {
    try {
        const userToSignIn = await User.findOne({ username: req.body.username })
        if (!userToSignIn) return res.status(401).send('User does not exist')
        if (!bcrypt.compareSync(req.body.password, userToSignIn.password)) {
            return res.status(401).send('Invalid credentials')
        }
        //console.log('REQ SESSION:', req.session)
        req.session.user = {
            _id: userToSignIn._id,
            username: userToSignIn.username
        }
        res.redirect('/auth/profile')
    } catch (error) {
        console.error('Something went wrong')
        return res.status(500).send('Something went wrong. Please try again later.')
    }
})

// * GET - auth/profile
router.get('/profile', isSignedIn, async (req, res) => {
    try {
        res.render('auth/profile.ejs', { user: req.session.user })
    } catch (error) {
        console.error('Something went wrong')
        return res.status(500).send('Something went wrong. Please try again later')
    }
})

// * GET - auth/sign-out
router.get('/sign-out', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
})

export default router 