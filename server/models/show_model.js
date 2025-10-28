import mongoose from 'mongoose';

const showSchema = new mongoose.Schema({
    showName: {
        type: String,
        required: function() {
            return this.isNew;
        },
        trim: true
    },
    timing: {
        type: Date,
        required: function() {
            return this.isNew;
        }
    },
    length: {
        type: Number,
        required: function() {
            return this.isNew;
        },
        min: 1
    },
    description: {
        type: String,
        required: function() {
            return this.isNew;
        },
        trim: true
    },
    posterUrl: {
        type: String,
        default: ''
    },
    cloudinaryPublicId: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    hall: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hall',
        required: function() {
            return this.isNew;
        }
    },
    status: {
        type: String,
        enum: ['scheduled', 'cancelled', 'completed'],
        default: 'scheduled'
    }
}, {
    timestamps: true
});

const Show = mongoose.model('Show', showSchema);

export default Show;