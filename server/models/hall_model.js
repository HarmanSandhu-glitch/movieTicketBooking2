import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const hallSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Hall name is required'],
        trim: true
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true
    },
    normalSittingCapacity: {
        type: Number,
        required: [true, 'Normal sitting capacity is required'],
        min: [1, 'Capacity must be at least 1']
    },
    vipSittingCapacity: {
        type: Number,
        required: [true, 'VIP sitting capacity is required'],
        min: [0, 'Capacity cannot be negative']
    },
    premiumSittingCapacity: {
        type: Number,
        required: [true, 'Premium sitting capacity is required'],
        min: [0, 'Capacity cannot be negative']
    },
    amenities: [{
        type: String,
        trim: true
    }],
    normalSeatPrice: {
        type: Number,
        required: true,
        min: 0
    },
    vipSeatPrice: {
        type: Number,
        required: true,
        min: 0
    },
    premiumSeatPrice: {
        type: Number,
        required: true,
        min: 0
    },
}, { timestamps: true });

const Hall = mongoose.model('Hall', hallSchema);

export default Hall;