import mongoose from 'mongoose'

const dogSchema = new mongoose.Schema ({
    name: {type: String, required: true}, 
    breed: {type: String, required: true}, 
    age: {type: Number, required: true},
    location: {type: String, required: true},
    description: {type: String, required: true}, 
    photoURL: {type: String},
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}, 
    likedByUsers: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
}) 

const Dog = mongoose.model('Dog', dogSchema)

export default Dog