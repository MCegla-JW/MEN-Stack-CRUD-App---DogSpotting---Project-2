import express from 'express'
import Dog from '../models/dog.js'
import isSignedIn from '../middleware/is-signed-in.js'
import User from '../models/user.js'
import upload from '../middleware/upload.js'
import { uploadBuffer } from '../config/cloudinary.js'

const router = express.Router()


// * GET - /dogs/new
router.get('/new', isSignedIn, (req, res) => {
    res.render('dogs/new.ejs')
})


router.get('/my-dogs', isSignedIn, async (req, res) => {
    try {
        const ownedDogSpots = await Dog.find({ owner: req.session.user._id})
        const likedDogs = await Dog.find({ likedByUsers: req.session.user._id })
        res.render('dogs/my-dogs.ejs', { ownedDogSpots, likedDogs })
    } catch (error) {
        console.error(error)
        res.status(500).send('Something went wrong. Please try again later.')
    }
})

// * GET - /:dogId 
router.get('/:dogId', async (req, res) => {
    try {
        const dogId = req.params.dogId
        const dog = await Dog.findById(dogId)
        .populate('owner') 
        .populate('ratings.user')
        const userHasLiked = dog.likedByUsers.some(user => {
            return user.equals(req.session.user._id)
        })
        const userHasRated = dog.ratings.some(rating => {
            return rating.user._id.equals(req.session.user._id)
        })
        res.render('dogs/show.ejs', { dog, user: req.session.user, userHasLiked, userHasRated })
    } catch (error) {
        console.error(error)
        return res.status(500).send('Something went wrong')
    }
})

// * POST 
router.post('/new', isSignedIn, upload.single('photoURL'), async (req, res, next) => {
    try {
        if (req.file) {
            const uploadResult = await uploadBuffer(req.file.buffer)
            req.body.photoURL = uploadResult.secure_url
            console.log('Upload succesful', uploadResult)
        }
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
            const uploadResult = await uploadBuffer(req.file.buffer)
            req.body.photoURL = uploadResult.secure_url
            console.log('Upload succesful', uploadResult)
        }
    
        const updatedDog = await Dog.findByIdAndUpdate(dogId, req.body)
        req.session.message = `Dog ${updatedDog.name} was succesfully updated.`
        return res.redirect(`/dogs/${dogId}`)
    } catch (error) {
        console.error(error)
        res.status(500).send('Something went wrong. Please try again')
    } 
    })

// * Add Favourite     
router.post('/:dogId/liked-by/:userId', isSignedIn, async (req, res) => {
    try {
        const dogId = req.params.dogId
        await Dog.findByIdAndUpdate(dogId, {
            $push: { likedByUsers: req.session.user._id},
        })
        res.redirect(`/dogs/${dogId}`)
    } catch (error) {
        console.error(error)
        res.status(500).send('Something went wrong. Please try again later.')
    }
})

// * Delete Favourite     
router.delete('/:dogId/liked-by/:userId', isSignedIn, async (req, res) => {
    try {
        const dogId = req.params.dogId
        await Dog.findByIdAndUpdate(dogId, {
            $pull: { likedByUsers: req.session.user._id},
        })
        res.redirect(`/dogs/${dogId}`)
    } catch (error) {
        console.error(error)
        res.status(500).send('Something went wrong. Please try again later.')
    }
})

// * Create rating 
// add rating object into the ratings array on the dog document 
router.post('/:dogId/rating', isSignedIn, async (req, res) => {
    try {
    const dogId = req.params.dogId
    const dog = await Dog.findById(dogId)
    req.body.user = req.session.user._id
    dog.ratings.push(req.body)
    await dog.save()
    res.redirect(`/dogs/${dogId}`)
    } catch (error) {
        console.error(error)
        res.status(500).send('Something went wrong')
    }
})

router.delete('/:dogId/rating', isSignedIn, async (req, res) => {
    try {
    const dogId = req.params.dogId
    const dog = await Dog.findById(dogId)
    req.body.user = req.session.user._id
    dog.ratings.pull(req.body)
    await dog.save()
    res.redirect(`/dogs/${dogId}`)
    } catch (error) {
        console.error(error)
        res.status(500).send('Something went wrong')
    }
})

export default router 