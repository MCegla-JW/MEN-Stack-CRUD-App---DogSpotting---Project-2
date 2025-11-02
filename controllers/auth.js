import express from 'express'

const router = express.Router()

// * Routes 

// * GET - auth/sign-up - form render
router.get('/sign-up', (req, res) => {
    res.render('auth/sign-up.ejs')
})

// * POST - auth/sing-up - send info to database


// * GET - auth/sign-in -form render
router.get('/sign-in', (req, res) => {
    res.render('auth/sign-in.ejs')
})

// * POST - auth/sign-in - send info to database


export default router 