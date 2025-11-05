import mongoose from 'mongoose'

const ratingSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    stars: { type: Number, min: 1, max: 5, required: true }
}, { 
    timestamps: true 
})

const dogSchema = new mongoose.Schema ({
    name: {type: String, required: true}, 
    breed: {type: String, required: true}, 
    age: {type: Number, required: true},
    location: {type: String, required: true},
    description: {type: String, required: true}, 
    photoURL: {type: String},
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}, 
    likedByUsers: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    ratings: [ratingSchema] 
}) 

const Dog = mongoose.model('Dog', dogSchema)

export default Dog