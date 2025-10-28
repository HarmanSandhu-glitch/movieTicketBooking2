import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const seatSchema = new Schema({
    hall: {
        type: Schema.Types.ObjectId,
        ref: 'Hall',
        required: true
    },
    seatNo: {
        type: String,
        required: true,
        trim: true
    },
    row: {
        type: String,
        required: true,
        trim: true
    },
    column: {
        type: Number,
        required: true
    },
    seatType: {
        type: String,
        required: true,
        enum: ['Regular', 'Premium', 'VIP'],
        default: 'Regular'
    },
    isReserved: {
        type: Boolean,
        default: false
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

seatSchema.index({ hall: 1, seatNo: 1 }, { unique: true });
seatSchema.index({ hall: 1, row: 1, column: 1 }, { unique: true });

const Seat = mongoose.model('Seat', seatSchema);

export default Seat;