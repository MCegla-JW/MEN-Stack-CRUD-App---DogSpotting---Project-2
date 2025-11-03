import express from 'express'
import Dog from '../models/dog.js'
import isSignedIn from '../middleware/is-signed-in.js'
import multer from 'multer'

const router = express.Router()
const upload = multer( {dest: 'uploads/'})

// * GET - /dogs/new
router.get('/new', isSignedIn, (req, res) => {
    res.render('dogs/new.ejs')
})

// * POST 
router.post('/new', isSignedIn, upload.single('photoURL'), async (req, res, next)  => {
    try {
        console.log('Upload succesful', req.file)
        req.body.owner = req.session.user._id
        const createdDog = await Dog.create(req.body)
        return res.redirect(`/dogs/${createdDog._id}`)
    } catch (error) {
        console.error(error)
        return res.status(500).send('Something went wrong. Please try again later.')
    }
})

export default router 