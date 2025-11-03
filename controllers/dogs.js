import express from 'express'
import Dog from '../models/dog.js'
import isSignedIn from '../middleware/is-signed-in.js'

const router = express.Router()

// * GET - /dgos/new

router.get('/new', isSignedIn, (req, res) => {
    res.render('dogs/new.ejs')
})

export default router 