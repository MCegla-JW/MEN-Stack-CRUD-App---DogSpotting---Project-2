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

// * GET - /:dogId 
router.get('/:dogId', async (req, res) => {
    const dog = req.body._id
    res.render(`/dogs/${dog._id}`)
})

// * POST 
router.post('/new', isSignedIn, upload.single('photoURL'), async (req, res, next)  => {
    try {
        console.log('Upload succesful', req.file)
        req.body.owner = req.session.user._id
        const createdDog = await Dog.create(req.body)
        return res.redirect(`/dogs/${createdDog._id}`) 
        next()
    } catch (error) {
        console.error(error)
        return res.status(500).send('Something went wrong. Please try again later.')
    }
})

router.get('/', async (req, res) => {
    try {
    const allDogs = await Dog.find()    
    res.render('dogs/dogs.ejs', { dogs: allDogs})
    } catch (error) {
        console.error(error)
        return res.status(500).send('Something went wrong. Please try again later.')
    }
})

export default router 