import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        select: false
    },
    confirm_password: {
        type: String,
        required: function () {
            return this.isNew || this.isModified('password');
        },
        select: false,
        validate: {
            validator: function (e) {
                return e === this.password;
            },
            message: 'Passwords do not match'
        }
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.confirm_password = undefined;
    next();
});

const User = mongoose.model('User', userSchema);


export default User;