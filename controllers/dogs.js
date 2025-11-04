import express from 'express'
import Dog from '../models/dog.js'
import isSignedIn from '../middleware/is-signed-in.js'
import multer from 'multer'

const router = express.Router()
const upload = multer({ dest: 'uploads/' })

// * GET - /dogs/new
router.get('/new', isSignedIn, (req, res) => {
    res.render('dogs/new.ejs')
})

// * GET - /:dogId 
router.get('/:dogId', async (req, res) => {
    try {
        const dogId = req.params.dogId
        const dog = await Dog.findById(dogId).populate('owner')
        res.render('dogs/show.ejs', { dog, user: req.session.user })
    } catch (error) {
        console.error(error)
        return res.status(500).send('Something went wrong')
    }
})

// * POST 
router.post('/new', isSignedIn, upload.single('photoURL'), async (req, res, next) => {
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
        res.render('dogs/dogs.ejs', { dogs: allDogs })
    } catch (error) {
        console.error(error)
        return res.status(500).send('Something went wrong. Please try again later.')
    }
})

// * DELETE 
router.delete('/:dogId', isSignedIn, async (req, res) => {
    try {
        const dogId = req.params.dogId
        const dogToDelete = await Dog.findById(dogId)
        if (!dogToDelete.owner.equals(req.session.user._id)) {
            return res.status(403).send('You do not have permission to perform this action')
        }
        const deletedDog = await Dog.findByIdAndDelete(dogId)
        req.session.message = `Dog ${deletedDog.name} was succesfully deleted.`
        res.redirect('/dogs')
    } catch (error) {
        console.error(error)
        res.status(500).send('Somethign went wrong. Please try again')
    }
})

// * EDIT - edit the listing
router.get('/:dogId/edit', isSignedIn, async (req, res) => {
    try {
        const dogId = req.params.dogId
        const dog = await Dog.findById(dogId)
        if (!dog.owner.equals(req.session.user._id)) {
            req.session.message = 'You do not have permission to edit this lsiting'
            return res.redirect(`/dogs/${dogId}`)
        }
        res.render('dogs/edit.ejs', { dog: dog })
    } catch (error) {
        console.error(error)
        res.status(500).send('Somethign went wrong. Please try again')
    }

})

// * UPDATE - update the listing 
router.put('/:dogId', isSignedIn, upload.single('photoURL'), async (req, res) => {
    try {
        const dogId = req.params.dogId
        const dog = await Dog.findById(dogId)
        if (!dog.owner.equals(req.session.user._id)) {
        req.session.message = 'Ypu do not have permission to edit this lsiting'
        return res.redirect(`/dogs/${dogId}`)
    }
        if (req.file) {
            req.body.photoURL = `/uploads/${req.file.filename}`
        }
        const updatedDog = await Dog.findByIdAndUpdate(dogId, req.body)
        req.session.message = `Dog ${updatedDog.name} was succesfully updated.`
        return res.redirect(`/dogs/${dogId}`)
    } catch (error) {
        console.error(error)
        res.status(500).send('Something went wrong. Please try again')
    } 
    })

export default router 