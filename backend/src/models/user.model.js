import mongoose from 'mongoosee';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'seller'],
        default: 'user'
    }
})

const userModel = mongoose.model("users",userSchema);

export default userModel;
